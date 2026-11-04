
from datetime import datetime, timezone
from uuid import uuid4

import pytest
import pytest_asyncio
from fastapi import HTTPException
from sqlalchemy import func, select

from api.services.questionnaires.exceptions import (
    QuestionnaireSessionNotFoundError,
)
from api.services.questionnaires.models import (
    Answer,
    Question,
    Questionnaire,
    QuestionnaireSession,
)
from api.services.questionnaires.schemas import AnswerCreate
from api.services.questionnaires.services.answers import (
    delete_session_answer,
    get_session_answer,
    list_session_answers,
    save_answer,
)


@pytest_asyncio.fixture
async def answer_setup(db):
    questionnaire = Questionnaire(
        slug=f"answer-test-{uuid4().hex[:8]}",
        label="Answer test",
    )
    db.add(questionnaire)
    await db.flush()

    text_question = Question(
        questionnaire_id=questionnaire.id,
        key="feedback",
        text="What do you think?",
        type="text",
        order=1,
        required=True,
        is_active=True,
    )
    single_question = Question(
        questionnaire_id=questionnaire.id,
        key="role",
        text="Choose your role",
        type="single_select",
        options=["creator", "reader"],
        order=2,
        required=True,
        is_active=True,
    )
    multi_question = Question(
        questionnaire_id=questionnaire.id,
        key="interests",
        text="Choose interests",
        type="multiselect",
        options=["art", "music", "writing"],
        order=3,
        required=False,
        is_active=True,
    )

    db.add_all([text_question, single_question, multi_question])
    await db.flush()

    session = QuestionnaireSession(
        questionnaire_id=questionnaire.id,
    )
    db.add(session)
    await db.commit()

    return {
        "questionnaire": questionnaire,
        "session": session,
        "text_question": text_question,
        "single_question": single_question,
        "multi_question": multi_question,
    }


@pytest.mark.asyncio
async def test_save_text_answer(db, answer_setup):
    data = answer_setup

    answer = await save_answer(
        db,
        data["session"].id,
        AnswerCreate(
            question_id=data["text_question"].id,
            answer_text="An honest answer",
        ),
    )

    assert answer.session_id == data["session"].id
    assert answer.question_id == data["text_question"].id
    assert answer.answer_text == "An honest answer"
    assert answer.answer_array is None


@pytest.mark.asyncio
async def test_save_single_select_answer(db, answer_setup):
    data = answer_setup

    answer = await save_answer(
        db,
        data["session"].id,
        AnswerCreate(
            question_id=data["single_question"].id,
            answer_array=["creator"],
        ),
    )

    assert answer.answer_array == ["creator"]
    assert answer.answer_text is None


@pytest.mark.asyncio
async def test_save_multiselect_answer(db, answer_setup):
    data = answer_setup

    answer = await save_answer(
        db,
        data["session"].id,
        AnswerCreate(
            question_id=data["multi_question"].id,
            answer_array=["art", "music"],
        ),
    )

    assert answer.answer_array == ["art", "music"]


@pytest.mark.asyncio
async def test_saving_answer_again_updates_existing_answer(
    db, answer_setup
):
    data = answer_setup
    session_id = data["session"].id
    question_id = data["text_question"].id

    first = await save_answer(
        db,
        session_id,
        AnswerCreate(
            question_id=question_id,
            answer_text="First answer",
        ),
    )

    second = await save_answer(
        db,
        session_id,
        AnswerCreate(
            question_id=question_id,
            answer_text="Updated answer",
        ),
    )

    count = await db.scalar(
        select(func.count())
        .select_from(Answer)
        .where(
            Answer.session_id == session_id,
            Answer.question_id == question_id,
        )
    )

    assert second.id == first.id
    assert second.answer_text == "Updated answer"
    assert count == 1


@pytest.mark.asyncio
async def test_rejects_invalid_selection(db, answer_setup):
    data = answer_setup

    with pytest.raises(HTTPException) as exc:
        await save_answer(
            db,
            data["session"].id,
            AnswerCreate(
                question_id=data["single_question"].id,
                answer_array=["invalid-option"],
            ),
        )

    assert exc.value.status_code == 422


@pytest.mark.asyncio
async def test_rejects_multiple_options_for_single_select(
    db, answer_setup
):
    data = answer_setup

    with pytest.raises(HTTPException) as exc:
        await save_answer(
            db,
            data["session"].id,
            AnswerCreate(
                question_id=data["single_question"].id,
                answer_array=["creator", "reader"],
            ),
        )

    assert exc.value.status_code == 422


@pytest.mark.asyncio
async def test_rejects_duplicate_multiselect_options(
    db, answer_setup
):
    data = answer_setup

    with pytest.raises(HTTPException) as exc:
        await save_answer(
            db,
            data["session"].id,
            AnswerCreate(
                question_id=data["multi_question"].id,
                answer_array=["art", "art"],
            ),
        )

    assert exc.value.status_code == 422


@pytest.mark.asyncio
async def test_rejects_question_from_another_questionnaire(
    db, answer_setup
):
    data = answer_setup

    other_questionnaire = Questionnaire(
        slug=f"other-{uuid4().hex[:8]}",
        label="Other questionnaire",
    )
    db.add(other_questionnaire)
    await db.flush()

    other_question = Question(
        questionnaire_id=other_questionnaire.id,
        key="other",
        text="Another question",
        type="text",
        order=1,
        required=False,
        is_active=True,
    )
    db.add(other_question)
    await db.commit()

    with pytest.raises(HTTPException) as exc:
        await save_answer(
            db,
            data["session"].id,
            AnswerCreate(
                question_id=other_question.id,
                answer_text="Not allowed",
            ),
        )

    assert exc.value.status_code == 422


@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_rejects_answer_for_completed_session(db, answer_setup):
    data = answer_setup

    data["session"].completed_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(data["session"], attribute_names=["completed_at"])

    with pytest.raises(HTTPException) as exc:
        await save_answer(
            db,
            data["session"].id,
            AnswerCreate(
                question_id=data["text_question"].id,
                answer_text="Too late",
            ),
        )

    assert exc.value.status_code == 409


@pytest.mark.asyncio
async def test_list_session_answers(db, answer_setup):
    data = answer_setup

    await save_answer(
        db,
        data["session"].id,
        AnswerCreate(
            question_id=data["text_question"].id,
            answer_text="Answer one",
        ),
    )
    await save_answer(
        db,
        data["session"].id,
        AnswerCreate(
            question_id=data["single_question"].id,
            answer_array=["reader"],
        ),
    )

    answers = await list_session_answers(db, data["session"].id)

    assert len(answers) == 2


@pytest.mark.asyncio
async def test_get_session_answer(db, answer_setup):
    data = answer_setup

    created = await save_answer(
        db,
        data["session"].id,
        AnswerCreate(
            question_id=data["text_question"].id,
            answer_text="Find me",
        ),
    )

    fetched = await get_session_answer(
        db,
        data["session"].id,
        data["text_question"].id,
    )

    assert fetched.id == created.id
    assert fetched.answer_text == "Find me"


@pytest.mark.asyncio
async def test_delete_session_answer(db, answer_setup):
    data = answer_setup

    created = await save_answer(
        db,
        data["session"].id,
        AnswerCreate(
            question_id=data["text_question"].id,
            answer_text="Delete me",
        ),
    )

    await delete_session_answer(
        db,
        data["session"].id,
        data["text_question"].id,
    )

    assert await db.get(Answer, created.id) is None


@pytest.mark.asyncio
async def test_missing_session_raises_not_found(db):
    with pytest.raises(QuestionnaireSessionNotFoundError):
        await list_session_answers(db, uuid4())


@pytest.mark.asyncio
async def test_missing_answer_raises_not_found(db, answer_setup):
    data = answer_setup

    with pytest.raises(HTTPException) as exc:
        await get_session_answer(
            db,
            data["session"].id,
            uuid4(),
        )

    assert exc.value.status_code == 404
