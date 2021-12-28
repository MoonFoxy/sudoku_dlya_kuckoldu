/**
 * Permanent storage for session
 */
export default class SessionHolderImpl {
  // eslint-disable-next-line class-methods-use-this
  public set session(value: string | null) {
    if (value) {
      localStorage.setItem(
        'session_id',
        value,
      );
    } else {
      localStorage.removeItem('session_id');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public get session(): string | null {
    return localStorage.getItem('session_id');
  }
}
