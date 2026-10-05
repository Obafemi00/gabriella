// Where to go after an auth step. Only same-site paths are allowed: the value must
// start with a single "/". Rejects "//host", "/\host", full URLs, whitespace and
// control characters (browsers strip some of these, turning "/\t/host" into "//host").
export function safeNext(value: string | null | undefined): string {
  if (!value || value[0] !== "/" || value[1] === "/") return "/";
  if (/[\\\x00-\x20\x7f]/.test(value)) return "/";
  return value;
}
