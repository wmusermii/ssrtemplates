declare global {
  namespace Express {
    interface Request {
      userInfo?: any;
      authInfo?: any;
    }
  }
}
export {}; // ⬅️ penting agar dianggap sebagai "external module"
