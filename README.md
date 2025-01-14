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
- Servidor mongo-express na porta 8090 para todos os grupos


Nas pastas api e web, há um diretório exemplo que possui o código de containers com aplicações web de transferência de arquivos com armazenamento no mongo. Vocês podem utilizar esse código como modelo para desenvolvimento da aplicação de IA. Há também a pasta api-ia/backend-image que contém o código de modelo de api utilizando recursos de IA para tratamento de imagens e que podem ser utilizadas como modelo para a aplicação de vocês.


Modelo para reconhecimento de voz:
O arquivo docker compose possui uma receita baseada no container disponível em:


 - https://hub.docker.com/r/onerahmet/openai-whisper-asr-webservice 


Esse container possui uma interface que fica disponível em localhost:9000/docs e que oferece a possibilidade de utilizá-la para transcrição de texto a partir de arquivos de voz. Utilizando os códigos fornecidos como modelo nos diretórios api e api-ia, vocês devem construir implementações que façam uso do serviço para fornecer alguma funcionalidade baseada nesses recursos para a aplicação. Pode ser extração de texto de áudio de usuários ou a rotulagem e classificação de imagens que sejam enviadas pelos usuários. 


Para criação do exemplo da pasta web, foram executados as seguintes instruções:

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


No exemplo, o nosso servidor web  renderiza a página imagepage.js. Quando o usuário seleciona uma imagem e clica em submit, é utilizado o axios para gerar uma requisição para nossa api com os dados da imagem que são salvos e retornados para nossa app, utilizando a api. Então, a biblioteca axios que fez a requisição irá renderizar a página com a resposta.


Para ver as aplicações em funcionamento, após efetuar a clonagem do repositório e abrir o diretório pi-inteligencia-artificial com o Visual Studio Code, você poderá executar as seguintes instruções em um terminal:

Para construir e executar todos os containers

           docker compose up -d

Para construir apenas um container:

           docker compose <nome_servico> up -d

           Por exemplo, para iniciar o serviço backend-image:

           docker compose backend-image up -d
