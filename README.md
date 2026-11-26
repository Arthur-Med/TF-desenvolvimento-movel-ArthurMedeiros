# TF-desenvolvimento-movel-ArthurMedeiros
Trabalho Final de Desenvolvimento Móvel - Arthur José Barbosa Medeiros

# App de Pokédex (Pokemon) 
App de Pokédex com uma navegação contendo seis telas distintas, tendo como 
objetivo principal funcionar como uma Pokédex interativa que consome dados da 
PokéAPI. O sistema reúne uma Tela Inicial com menu introdutório e atalhos rápidos e 
um Pokémon em destaque do dia aleatoriamente sorteado. A tela Pokédex, com 
listagem paginada, busca e filtro por elemento. A tela de Detalhes, que exibe imagem 
em sprite oficial, os tipos, status base, ataques, fraquezas e o botão para favoritar o 
Pokémon. Utilizando o Async Storage, vai possuir a tela de Favoritos, para consultar e 
gerenciar os itens salvos localmente no dispositivo. A tela de Batalha, onde o usuário 
escolhe um Pokémon para enfrentar um adversário aleatório em duelos por turnos 
baseados nos atributos da API, e por fim a Tela Sobre, acessada pelo menu lateral com 
informações do aplicativo.  

API: pokeapi.co 

Sistema irá conter as seguintes interfaces: 

Drawer Principal:  
1. Tela 1 — Início: Menu introdutório com identidade visual da Pokédex, atalhos 
rápidos e um "Pokémon em Destaque do Dia" sorteado. 

2. Tela 2 — Lista da Pokédex: Grid paginado FlatList com infinite scroll de 20 em 
20 com barra de busca por nome/número e filtro rápido por tipo. 

3. Tela 3 — Detalhes do Pokémon: Recebe o ID/nome via route.params e exibe 
sprite oficial, tipos, status base (HP, Atk, Def, SpA, SpD, Spe) em barras, lista 
resumida de golpes, cadeia evolutiva e botão de favoritar. 

4. Tela 4 — Favoritos: Lista utilizando AsyncStorage com os Pokémon favoritados, 
permitindo abrir os detalhes ou remover da lista com estado vazio caso não 
tenha favoritos. 

5. Tela 5 — Batalha Pokémon: Tela interativa de duelo por turnos onde o usuário 
escolhe um Pokémon para enfrentar um adversário aleatório da PokéAPI, 
utilizando os status base (HP, Ataque, Defesa) e os quatro primeiros golpes 

6. Tela 6 — Sobre o App: Contém informações acadêmicas do projeto, créditos à 
PokéAPI v2, tecnologias utilizadas.
