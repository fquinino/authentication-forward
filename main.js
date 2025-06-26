export default {
  async fetch(request, env) {
    const BASIC_USER = "admin";
    const BASIC_PASS = env.PASSWORD;
    
    const authorization = request.headers.get("Authorization");
    
    if (!authorization) {
      return new Response("Autenticação necessária", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Área Restrita"'
        }
      });
    }
    
    const [scheme, encoded] = authorization.split(" ");
    if (scheme !== "Basic") {
      return new Response("Tipo de autenticação inválido", {
        status: 400
      });
    }
    
    const credentials = atob(encoded);
    const [user, pass] = credentials.split(":");
    
    if (user !== BASIC_USER || pass !== BASIC_PASS) {
      return new Response("Credenciais inválidas", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Área Restrita"'
        }
      });
    }
    
    // Requisição autenticada - prosseguir para origem
    return fetch(request);
  }
};