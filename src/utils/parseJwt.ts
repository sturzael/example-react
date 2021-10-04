interface Token {
  accessToken: string;
  refreshToken: string;
}

interface ParsedToken {
  firstName: string;
  lastName: string;
  userName: string;
}

const parseJwt = (token: Token): ParsedToken | null => {
  if (!token) {
    return;
  }

  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
};

export default parseJwt;

