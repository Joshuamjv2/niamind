class QuestionnaireNotFoundError(Exception):
    """Raised when a questionnaire does not exist."""


class QuestionnaireSlugConflictError(Exception):
    """Raised when a questionnaire slug is already in use."""


# Add the Question / Session / Answer exceptions here as those services are built,
# so the routes can map every domain error from a single import.

class QuestionNotFoundError(Exception):
    """Raised when a questionnaire slug is already in use."""
