-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('player', 'admin');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nom TEXT NOT NULL,
  role user_role DEFAULT 'player',
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mini games table
CREATE TABLE public.mini_games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points_reward INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Participations table
CREATE TABLE public.participations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  game_id UUID REFERENCES public.mini_games(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL DEFAULT 0,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id, DATE(played_at))
);

-- Rewards table
CREATE TABLE public.rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  points_required INTEGER NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchases table
CREATE TABLE public.purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE,
  points_spent INTEGER NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mini_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for mini_games table
CREATE POLICY "Everyone can view active mini games" ON public.mini_games
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage mini games" ON public.mini_games
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for participations table
CREATE POLICY "Users can view their own participations" ON public.participations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own participations" ON public.participations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all participations" ON public.participations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for rewards table
CREATE POLICY "Everyone can view available rewards" ON public.rewards
  FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage rewards" ON public.rewards
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for purchases table
CREATE POLICY "Users can view their own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases" ON public.purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions for automatic user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nom)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nom', 'Joueur')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user points
CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users 
  SET total_points = total_points + NEW.points_earned
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update points on participation
DROP TRIGGER IF EXISTS on_participation_created ON public.participations;
CREATE TRIGGER on_participation_created
  AFTER INSERT ON public.participations
  FOR EACH ROW EXECUTE FUNCTION public.update_user_points();

-- Function to deduct points on purchase
CREATE OR REPLACE FUNCTION public.deduct_user_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users 
  SET total_points = total_points - NEW.points_spent
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to deduct points on purchase
DROP TRIGGER IF EXISTS on_purchase_created ON public.purchases;
CREATE TRIGGER on_purchase_created
  AFTER INSERT ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION public.deduct_user_points();

-- Insert some sample data
INSERT INTO public.mini_games (title, description, points_reward) VALUES
('Quiz Culture Générale', 'Testez vos connaissances en culture générale', 10),
('Memory Game', 'Mémorisez les cartes et retrouvez les paires', 15),
('Math Challenge', 'Résolvez des équations mathématiques rapidement', 20),
('Word Puzzle', 'Trouvez les mots cachés dans la grille', 12),
('Color Match', 'Associez les couleurs le plus rapidement possible', 8);

INSERT INTO public.rewards (title, description, points_required, stock_quantity) VALUES
('Badge Bronze', 'Badge de participation bronze', 50, NULL),
('Badge Argent', 'Badge de participation argent', 100, NULL),
('Badge Or', 'Badge de participation or', 200, NULL),
('Bon Café', 'Un café offert dans notre cafétéria', 75, 20),
('T-shirt ZouPlay', 'T-shirt exclusif ZouPlay', 150, 10),
('Carte Cadeau 10€', 'Carte cadeau de 10 euros', 300, 5);