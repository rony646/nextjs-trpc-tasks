import type { Task } from "./task.schema";

const MS_PER_HOUR = 3_600_000;

const SEED_TASKS: Pick<Task, "titulo" | "descricao">[] = [
  {
    titulo: "Revisar relatório mensal",
    descricao: "Conferir os números de vendas antes de enviar.",
  },
  { titulo: "Organizar arquivos do projeto" },
  {
    titulo: "Atualizar dependências",
    descricao: "Verificar notas de versão antes de atualizar.",
  },
  { titulo: "Preparar apresentação da sprint" },
  {
    titulo: "Responder e-mails pendentes",
    descricao: "Priorizar os que estão sem resposta há mais tempo.",
  },
  { titulo: "Planejar a semana" },
  {
    titulo: "Escrever documentação da API",
    descricao: "Incluir exemplos de requisição e resposta.",
  },
  { titulo: "Fazer backup dos documentos" },
  {
    titulo: "Corrigir bug no formulário de cadastro",
    descricao: "O campo de data não aceita o formato dd/mm/aaaa.",
  },
  { titulo: "Revisar pull requests abertos" },
  {
    titulo: "Agendar reunião de alinhamento",
    descricao: "Encontrar um horário livre para toda a equipe.",
  },
  { titulo: "Limpar a caixa de entrada" },
  {
    titulo: "Estudar testes automatizados",
    descricao: "Ler a documentação do Vitest.",
  },
  { titulo: "Comprar material de escritório" },
  {
    titulo: "Configurar ambiente de homologação",
    descricao: "Usar as mesmas variáveis do ambiente de produção.",
  },
  { titulo: "Atualizar o quadro de tarefas" },
  {
    titulo: "Revisar o orçamento do trimestre",
    descricao: "Comparar o previsto com o realizado.",
  },
  { titulo: "Testar a nova versão do aplicativo" },
  {
    titulo: "Criar checklist de publicação",
    descricao: "Listar os passos para publicar uma nova versão.",
  },
  { titulo: "Arquivar projetos concluídos" },
  {
    titulo: "Melhorar mensagens de erro",
    descricao: "Deixar claro o que o usuário precisa corrigir.",
  },
  { titulo: "Renovar a assinatura do domínio" },
  {
    titulo: "Escrever o resumo da reunião",
    descricao: "Registrar as decisões e os próximos passos.",
  },
  { titulo: "Ajustar o layout da página inicial" },
  {
    titulo: "Revisar permissões de acesso",
    descricao: "Remover acessos que não são mais usados.",
  },
  { titulo: "Monitorar o uso de memória" },
  {
    titulo: "Padronizar nomes de variáveis",
    descricao: "Seguir o guia de estilo do projeto.",
  },
  { titulo: "Separar tarefas para a próxima sprint" },
  {
    titulo: "Medir o tempo de carregamento",
    descricao: "Comparar antes e depois das otimizações.",
  },
  { titulo: "Ler artigos sobre acessibilidade" },
  {
    titulo: "Revisar contratos de fornecedores",
    descricao: "Verificar prazos de renovação e reajustes.",
  },
  { titulo: "Atualizar o README do projeto" },
  {
    titulo: "Configurar alertas de monitoramento",
    descricao: "Avisar a equipe quando a taxa de erros subir.",
  },
  { titulo: "Organizar a pasta de downloads" },
  {
    titulo: "Preparar o onboarding do novo colega",
    descricao: "Separar acessos, documentos e um primeiro desafio.",
  },
  { titulo: "Remover código não utilizado" },
  {
    titulo: "Definir metas do próximo trimestre",
    descricao: "Alinhar as prioridades com a liderança.",
  },
  { titulo: "Testar o site em dispositivos móveis" },
  {
    titulo: "Revisar o fluxo de recuperação de senha",
    descricao: "Garantir que o link expira no prazo correto.",
  },
  { titulo: "Atualizar a foto do perfil da equipe" },
];

export function createSeedTasks(now = new Date()): Task[] {
  return SEED_TASKS.map(({ titulo, descricao }, index) => {
    const createdAt = new Date(now.getTime() - index * MS_PER_HOUR);
    return {
      id: crypto.randomUUID(),
      titulo,
      descricao,
      dataCriacao: createdAt,
      dataAtualizacao: createdAt,
    };
  });
}
