CREATE TABLE public.menu_items (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(8,2) NOT NULL DEFAULT 0,
  image text NOT NULL DEFAULT 'local:hero',
  position text NOT NULL DEFAULT 'center',
  available boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read available menu" ON public.menu_items FOR SELECT TO anon, authenticated USING (available = true);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number serial,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  address text,
  postal text,
  city text,
  notes text,
  delivery text NOT NULL,
  payment text NOT NULL,
  items jsonb NOT NULL,
  subtotal numeric(8,2) NOT NULL,
  delivery_fee numeric(8,2) NOT NULL DEFAULT 0,
  total numeric(8,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.orders TO service_role;
GRANT USAGE ON SEQUENCE public.orders_number_seq TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

INSERT INTO public.menu_items (id,name,category,description,price,image,position,sort_order) VALUES
('complete','La Complète','Galettes','Presunto fumado, ovo caseiro, comté curado e manteiga salgada.',14.5,'local:hero','center',1),
('foret','La Forêt','Galettes','Cogumelos assados, creme de comté, tomilho fresco e salada.',15.5,'local:menu','73% center',2),
('armor','L’Armor','Spécialités','Salmão, alho-francês, creme de limão e endro.',17.5,'local:craft','center',3),
('caramel','Caramelo com manteiga salgada','Crêpes','Caramelo caseiro com manteiga salgada, com um toque francês.',9.5,'local:menu','17% center',4),
('citron','Limão & Açúcar','Crêpes','Limão fresco, açúcar e manteiga noisette.',7.5,'local:menu','48% 76%',5),
('far','Far Breton','Desserts','Ameixas, baunilha e creme ligeiramente batido.',8,'local:maison','69% center',6),
('mini-pancakes','Mini pancakes','Desserts','Pequenos, fofos e perfeitos para partilhar — feitos na hora.',5,'https://images.unsplash.com/photo-1776073975852-435302bbbe7a?auto=format&fit=crop&w=1200&q=85','center',7),
('algodao-doce','Algodão doce','Desserts','Leve, divertido e perfeito para festas e eventos.',4,'https://images.unsplash.com/photo-1693122070191-277d7274cf46?auto=format&fit=crop&w=1200&q=85','center',8),
('cidre','Cidre Brut','Boissons','Sidra artesanal bretã, fresca e delicadamente frutada.',5.5,'local:maison','center',9),
('jus','Sumo de maçã','Boissons','Sumo puro de maçã, de produção artesanal.',4.5,'local:hero','18% center',10);