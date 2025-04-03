export function registration() {}

export function login() {}

export function auth(req: any, res: any) {
  return res.json({ authenticated: true });
}
