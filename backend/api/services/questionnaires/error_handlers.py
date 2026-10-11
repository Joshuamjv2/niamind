from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from .exceptions import (
    QuestionnaireNotFoundError,
    QuestionnaireSlugConflictError,
)


def register_exception_handlers(app: FastAPI) -> None:
    """Map questionnaire domain errors to HTTP responses.

    Call once at startup: register_exception_handlers(app). The body shape
    ({"detail": ...}) matches FastAPI's HTTPException.
    """

    @app.exception_handler(QuestionnaireNotFoundError)
    async def questionnaire_not_found_handler(request: Request, exc: QuestionnaireNotFoundError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": str(exc)},
        )

    @app.exception_handler(QuestionnaireSlugConflictError)
    async def questionnaire_slug_conflict_handler(request: Request, exc: QuestionnaireSlugConflictError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": str(exc)},
        )
