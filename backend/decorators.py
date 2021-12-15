def requires_grid(func):
    """Solves the puzzle before returning"""

    def wrapped(self, *args, **kwargs):
        if self.grid is None:
            self.init_grid()

        return func(self, *args, **kwargs)
    return wrapped
