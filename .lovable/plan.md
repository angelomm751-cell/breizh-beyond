# BREIZH FOOD — website e experiência de encomenda

## Objetivo
Criar de raiz uma presença digital francesa premium, cinematográfica e totalmente responsiva, com navegação editorial e uma experiência de encomenda demonstrativa pronta para futura integração real.

## Estrutura
- **Accueil**: introdução curta de marca, composição fotográfica assimétrica, assinatura “Bretagne · France · Portugal”, destaques da história, pratos, viagem gastronómica, ambiente e chamada final.
- **Notre Histoire**: narrativa editorial Bretagne → France → Portugal, com fotografias sobrepostas, coordenadas e detalhes finos.
- **La Carte**: catálogo visual por categorias, produtos editáveis numa fonte de dados única, preços e adição ao carrinho.
- **Galerie**: composição editorial irregular com imagens verticais, horizontais e amplas; lightbox acessível.
- **Commander**: seleção de produtos, carrinho lateral, quantidades, subtotal e total.
- **Checkout**: formulário móvel simples, escolha de entrega ao domicílio e confirmação “Merci”. O envio será demonstrativo, sem pagamento ou gravação real.
- **Contact**: contactos, localização e horários apresentados como conteúdo de demonstração claramente substituível.

## Identidade e conteúdo visual
- Paleta em creme quente, azul-marinho profundo, nogueira, champagne gold, vinho e preto suave.
- Títulos em **Cormorant Garamond** e texto em **Manrope**, com microtipografia editorial.
- Textura de papel subtil criada em CSS e madeira usada apenas em secções de contraste.
- Fotografias originais já criadas para campanha, preparação artesanal, carta e interior da maison; derivações de enquadramento serão usadas para manter coerência sem imagens genéricas.
- Símbolo tipográfico “BF” e favicon próprio, sem reutilizar a identidade padrão.

## Movimento e interação
- Abertura curta com linha desenhada, revelação tipográfica, máscara da fotografia e stagger.
- Revelações por scroll via `IntersectionObserver`, máscaras, linhas animadas e parallax leve baseado em CSS/transform.
- Header que reduz no scroll, menu móvel fullscreen com entrada sequencial e foco controlado.
- Produtos com zoom/crop, contorno fino e deslocamento de informação; equivalentes de touch no mobile.
- Carrinho com contador animado, painel lateral, controlo +/− e totais atualizados.
- Transições suaves com easing editorial; todos os efeitos desativados ou simplificados em `prefers-reduced-motion`.

## Fundação técnica
- Manter TanStack Start e criar uma página distinta para cada área partilhável, com metadados próprios.
- Componentes partilhados para header, footer, linhas editoriais, imagens reveladas, produtos, carrinho e formulário.
- Estado do carrinho no cliente durante a sessão; sem inventar pagamentos, disponibilidade ou integrações externas.
- Design tokens completos em CSS e estilos sem cores ad hoc nos componentes.
- Imagens com dimensões estáveis, lazy loading fora da primeira vista e ausência de overflow horizontal.

## Verificação
- Confirmar compilação, erros de consola e navegação entre todas as páginas.
- Testar menu móvel, filtros, adicionar/remover produtos, quantidades, carrinho, checkout e confirmação.
- Rever visualmente em 390 px, tablet e desktop, incluindo sobreposições e overflow.
- Repetir o fluxo com movimento reduzido e validar navegação por teclado, foco, labels e textos alternativos.
