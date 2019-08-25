import Bee from 'bee-queue';
import SubscribeMail from '../app/jobs/SubscribeMail';
import redisConfig from '../config/redis';

const jobs = [SubscribeMail];

class Queue {
  queues = {}

  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    // ao iniciar a classe Queue ele faz um loop pelo vetor de jobs
    // e cria um novo objeto dentro de queues com a chave do job
    // e criando uma nova fila usando o bee passando as configurações do
    // redis e o handle(a função que sea executada na fila)
    jobs.forEach((job) => {
      const { key, handle } = job;
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // adiciona um job a fila especifica, passa a key da fila e cria o job
  // passando as variaveis necessarias.
  add(key:string, job) {
    return this.queues[key].bee.createJob(job).save();
  }

  processQueue() {
    // faz um for pelo objetos jobs e para cada job ele pega a key,
    // e usa ela para acessar os metodos que da key.
    // então executa o process da fila passando o handle(função) como parametro
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];

      bee.process(handle);
    });
  }
}

export default new Queue();
