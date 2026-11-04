from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from .exceptions import (
    QuestionnaireInactiveError,
    QuestionnaireNotFoundError,
    QuestionnaireSessionNotFoundError,
    QuestionnaireSlugConflictError,
    RequiredQuestionUnansweredError,
)


def register_exception_handlers(app: FastAPI) -> None:
    """Map questionnaire domain errors to HTTP responses.

    Call once at startup: register_exception_handlers(app).
    The body shape ({"detail": ...}) matches FastAPI's HTTPException.
    """

    @app.exception_handler(QuestionnaireNotFoundError)
    async def questionnaire_not_found_handler(
        request: Request, exc: QuestionnaireNotFoundError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": str(exc)},
        )

    @app.exception_handler(QuestionnaireSlugConflictError)
    async def questionnaire_slug_conflict_handler(
        request: Request, exc: QuestionnaireSlugConflictError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": str(exc)},
        )

    @app.exception_handler(QuestionnaireInactiveError)
    async def questionnaire_inactive_handler(
        request: Request, exc: QuestionnaireInactiveError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": str(exc)},
        )

    @app.exception_handler(QuestionnaireSessionNotFoundError)
    async def questionnaire_session_not_found_handler(
        request: Request, exc: QuestionnaireSessionNotFoundError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": str(exc)},
        )

    @app.exception_handler(RequiredQuestionUnansweredError)
    async def required_question_unanswered_handler(
        request: Request, exc: RequiredQuestionUnansweredError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": str(exc)},
        )
