// Adiciona variaveis ao req para ser usado a qualquer momento
declare namespace Express {
  export interface Request {
     userId?: number
  }
}
