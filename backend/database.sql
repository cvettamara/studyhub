-- USERS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- FORUM POSTS
CREATE TABLE forum_posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  subject VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- FORUM ANSWERS
CREATE TABLE forum_answers (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- POST LIKES
CREATE TABLE post_likes (
  post_id INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- MARKETPLACE
CREATE TABLE marketplace_listings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) DEFAULT 0 CHECK (price >= 0),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- EVENTS
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  event_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- EVENT PARTICIPANTS
CREATE TABLE event_participants (
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

-- MAP LOCATIONS
CREATE TABLE map_locations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  latitude DECIMAL(9,6) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude DECIMAL(9,6) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- MAP RATINGS
CREATE TABLE map_ratings (
  id SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL REFERENCES map_locations(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, location_id)
);

-- ИНДЕКСИ
CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX idx_forum_answers_post_id ON forum_answers(post_id);
CREATE INDEX idx_forum_answers_user_id ON forum_answers(user_id);
CREATE INDEX idx_marketplace_listings_user_id ON marketplace_listings(user_id);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_map_locations_user_id ON map_locations(user_id);
CREATE INDEX idx_map_ratings_location_id ON map_ratings(location_id);
CREATE INDEX idx_map_ratings_user_id ON map_ratings(user_id);