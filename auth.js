// Authentication utilities

async function getCurrentUser() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) return null;
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.warn('Profile not found, returning user data only');
      return { ...user.user_metadata, email: user.email, id: user.id };
    }
    
    return profile;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

async function signUp(email, password, fullName, school, grade) {
  try {
    // Validate inputs
    if (!email || !password || !fullName || !school || !grade) {
      throw new Error('Sabhi fields fill karna zaroori hai');
    }

    if (password.length < 6) {
      throw new Error('Password kam se kam 6 characters ka hona chahiye');
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName.trim(),
          school: school.trim(),
          grade: parseInt(grade)
        }
      }
    });
    
    if (error) {
      console.error('Supabase signup error:', error);
      
      // Handle specific errors
      if (error.message.includes('Signups not allowed')) {
        throw new Error('Registration abhi available nahi hai. Admin se contact karein.');
      }
      if (error.message.includes('rate limit') || error.message.includes('Too many')) {
        throw new Error('Bahut zyada attempts. 10 minute wait karein.');
      }
      if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        throw new Error('Email pehle se registered hai. Login karein.');
      }
      if (error.message.includes('Password')) {
        throw new Error('Password kam se kam 6 characters ka hona chahiye');
      }
      
      throw new Error(error.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('SignUp error:', error);
    throw error;
  }
}

async function signIn(email, password) {
  try {
    if (!email || !password) {
      throw new Error('Email aur password dono required hain');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });
    
    if (error) {
      // Email verification error ko ignore karein - directly login karein
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Email verified nahi hai, lekin login ho jayega.');
      }
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email ya password galat hai');
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('SignIn error:', error);
    throw error;
  }
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

function requireAuth() {
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) {
      window.location.href = 'auth.html';
    }
  });
}

function requireAdmin() {
  getCurrentUser().then(user => {
    if (!user || user.role !== 'admin') {
      window.location.href = 'index.html';
    }
  });
}