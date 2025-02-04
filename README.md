# IMPORTANTE: SOBRE A ENTREGA

A entrega deverá ser realizada com a postagem da url do seu fork do repositório. No formulário que será disponibilizado, você deverá informar apenas a url do seu fork do projeto.

Atenção:
- As entregas serão individuais: cada aluno deverá informar seu fork.
- Não serão considerados trabalhos iguais e, caso ocorram duas entregas iguais a que tiver as datas de commit anteriores será a única considerada;
- Você deve descrever a funcionalidade que será implementada e qual a sua utilidade no contexto do projeto;
- O seu README deve conter as instruções para executar o projeto e acessar a(s) funcionalidade(s) prevista(s);
- REFORÇANDO: as entregas serão com a postagem da url do fork no github. Não serão aceitos arquivos, zips, links para implementações ou novos repositórios que não sejam fork desse repositório.
- No caso de não ocorrer a entrega ou de ela não estar de acordo com a proposta, será necessário efetuar a matrícula na disciplina de IA e cursá-la INTEGRALMENTE e PRESENCIALMENTE, para conclusão do curso com a turma de 2025.

# Contextualização:

Os projetos foram convertidos para containers dockers. Há um container para cada servidor web e para cada api. Para isso, foram isolados os ambientes api e web que se encontram em duas pastas no repositório. Dentro delas, há uma pasta grupo-x para cada grupo. 


Para cada grupo, dentro da pasta “web/grupo-x” foram ajustados:
- webserver.js 
- package.json
- Pasta views em que foi colocado todo o conteúdo web
- Dockerfile necessário para executar o projeto
- .dockerignore para exclusão do que não é necessário


Da mesma forma, dentro da pasta “api/grupo-x” foram ajustados:
- server.js 
- package.json
- Dockerfile necessário para executar o projeto


Foi criado o container mongo para um servidor mongo que é compartilhado por todos os grupos na porta 27017 do cluster e um mongo-express que é um container que se conecta ao mongo para gerenciamento e atende na porta 8090.


Na pasta raiz do projeto há o arquivo compose.yaml que compila e executa o código de todos os containers. Cada um está associado aos seguintes recursos:
- Servidor web: porta 8001 para o grupo 1, 8002 para o grupo 2 e assim sucessivamente.
- Servidor api: porta 3001 para o grupo 1, 3002 para o grupo e  assim sucessivamente
- Servidor mongo atendendo na porta 27017
- Servidor mongo-express (Gerenciador Web do Mongo) na porta 8090 para todos os grupos


Nas pastas api e web, há um diretório exemplo que possui o código de containers com aplicações web de transferência de arquivos com armazenamento no mongo. O container exemplo da pasta web é um servidor de páginas node que faz requisições para o servidor exemplo da pasta api que salva os arquivos recebidos no mongo. 

# Modelo para rotulação de imagens:
Vocês podem utilizar esse código como modelo para desenvolvimento das requisições de uma aplicação de IA. Há também a pasta api-ia/backend-image que contém o código de modelo de api utilizando recursos de IA para tratamento de imagens e que podem ser utilizadas como modelo para a aplicação de vocês.


# Modelos para reconhecimento de voz:
O arquivo docker compose possui uma receita baseada no container disponível em:


 - https://hub.docker.com/r/onerahmet/openai-whisper-asr-webservice


Esse container possui uma interface que fica disponível em localhost:9000/docs e que oferece a possibilidade de utilizá-la para transcrição de texto a partir de arquivos de gravação de voz no formato mp3. 
Há um segundo modelo na pasta api-ia/backend-files que também faz transcrição de voz, mas com uma implementação diferente dela em que vocês tem acesso aos arquivos que a compõem. 


Utilizando os códigos fornecidos como modelo nos diretórios api e api-ia, vocês devem construir implementações que façam uso do serviço para fornecer alguma funcionalidade baseada nesses recursos para a aplicação. Pode ser extração de texto de áudio de usuários ou a rotulagem e classificação de imagens que sejam enviadas pelos usuários. 


Para criação dos exemplos da pasta web, foram executados as seguintes instruções:

	npm install ejs –save

	npm install body-parser –save

	npm install express –save

	npm install axios –save

        npm install multer –save

Para criação do exemplo da pasta api, foram executados as seguintes instruções:

	npm install body-parser –save

	npm install express –save

        npm install mongoose –save

        npm install multer –save

        npm install dotenv –save


Foi criado o arquivo server.js e o arquivo model.js para armazenar nossas imagens no mongo. 


No exemplo disponível na pasta web, o nosso servidor renderiza a página imagepage.js. Para isso, faz uma requisição ao servidor da api que consulta o servidor mongo e devolve as imagens existentes. O servidor de api também recebe as imagens do formulário e quando o usuário seleciona uma imagem e clica em submit, é utilizado o axios para gerar uma requisição para a api com os dados da imagem que são salvos e retornados para nossa app web. Então, a biblioteca axios que fez a requisição irá renderizar a página com a resposta.


Para ver as aplicações em funcionamento, após efetuar a clonagem do repositório e abrir o diretório pi-inteligencia-artificial com o Visual Studio Code, você poderá executar as seguintes instruções em um terminal:

Para construir e executar todos os containers

           docker compose up -d

Para construir apenas um container:

           docker compose <nome_servico> up -d

           Por exemplo, para iniciar apenas o serviço backend-image:

           docker compose backend-image up -d

Estudem as aplicações do modelo para que possam tirar suas dúvidas a partir do dia 21/01 e realizar as implementações nos seus projetos. 

Bom final de férias e até lá,
Prof. Marco.


Descrição do Projeto

Este projeto utiliza a API do Gemini AI para gerar automaticamente descrições detalhadas para eventos criados no site. Com essa funcionalidade, os usuários podem criar descrições otimizadas e atrativas sem esforço e em poucos cliques.

Configuração e Instalação

1. Obtenha a Chave da API Gemini AI

Para utilizar a IA, é necessário obter uma chave de acesso. Para isso, acesse o link abaixo e gere sua chave:

https://aistudio.google.com/app/apikey

2. Configure a Chave no Projeto

Após obter sua chave, adicione-a ao arquivo .env localizado na pasta api/grupo-1 do projeto. O arquivo .env deve conter as seguintes linhas:

MONGODB_URL=mongodb://localhost:27017/eventos
GEMINI_API_KEY=SUA_CHAVE_AQUI

3. Execute os Servidores

Para iniciar o projeto corretamente, execute os dois servidores necessários:

# No backend
cd api/grupo-1
npm install  # Caso não tenha instalado as dependências
npm install @google/generative-ai express cors body-parser dotenv #para instalar as dependências da Inteligência Artficial 
npm start ou node server.js

# No frontend
cd web/grupo-1
npm install  # Caso não tenha instalado as dependências
npm start ou node webserver.js

4. Utilize a Geração de Descrição

Entre no site, realize o login e acesse a tela de criação de eventos. Após esse processo:

Localize o botão roxo "Gerar Descrição".

Insira palavras-chave na caixa de texto.

Clique no botão e aguarde a IA gerar uma descrição personalizada automaticamente.

Com isso, você poderá criar descrições impactantes e otimizadas para seus eventos de forma simples e eficiente.

Preencha os demais campos e clique em Cadastrar Evento.

Ao voltar para a página inicial, o evento estará cadastrado
