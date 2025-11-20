-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('doctor', 'hospital', 'admin');
CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'shortlisted', 'rejected', 'hired');
CREATE TYPE job_status AS ENUM ('active', 'closed', 'draft');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    profile_id UUID,
    is_verified BOOLEAN DEFAULT FALSE
);

-- Doctor profiles table
CREATE TABLE public.doctor_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    specialties TEXT[] DEFAULT '{}',
    license_numbers TEXT[] DEFAULT '{}',
    bio TEXT,
    cv_url TEXT,
    locations TEXT[] DEFAULT '{}',
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    experience_years INTEGER CHECK (experience_years >= 0),
    availability TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hospital profiles table
CREATE TABLE public.hospital_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    name TEXT NOT NULL,
    address TEXT,
    contact_email TEXT,
    logo_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    description TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE public.jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    hospital_id UUID REFERENCES public.hospital_profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    salary_min INTEGER,
    salary_max INTEGER,
    location TEXT NOT NULL,
    remote BOOLEAN DEFAULT FALSE,
    shift TEXT,
    department TEXT,
    contract_type TEXT,
    status job_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE public.applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES public.doctor_profiles(id) ON DELETE CASCADE NOT NULL,
    cover_letter TEXT,
    status application_status DEFAULT 'pending',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, doctor_id)
);

-- Messages table
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    thread_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    payload JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_doctor_profiles_user_id ON public.doctor_profiles(user_id);
CREATE INDEX idx_doctor_profiles_specialties ON public.doctor_profiles USING GIN(specialties);
CREATE INDEX idx_doctor_profiles_locations ON public.doctor_profiles USING GIN(locations);
CREATE INDEX idx_hospital_profiles_user_id ON public.hospital_profiles(user_id);
CREATE INDEX idx_jobs_hospital_id ON public.jobs(hospital_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_location ON public.jobs(location);
CREATE INDEX idx_applications_job_id ON public.applications(job_id);
CREATE INDEX idx_applications_doctor_id ON public.applications(doctor_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_thread_id ON public.messages(thread_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Doctor profiles policies
CREATE POLICY "Anyone can view verified doctor profiles" ON public.doctor_profiles
    FOR SELECT USING (verified = true);

CREATE POLICY "Doctors can view their own profile" ON public.doctor_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Doctors can update their own profile" ON public.doctor_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Doctors can insert their own profile" ON public.doctor_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Hospital profiles policies
CREATE POLICY "Anyone can view verified hospital profiles" ON public.hospital_profiles
    FOR SELECT USING (verified = true);

CREATE POLICY "Hospitals can view their own profile" ON public.hospital_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Hospitals can update their own profile" ON public.hospital_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Hospitals can insert their own profile" ON public.hospital_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Anyone can view active jobs" ON public.jobs
    FOR SELECT USING (status = 'active');

CREATE POLICY "Hospitals can view their own jobs" ON public.jobs
    FOR SELECT USING (
        hospital_id IN (
            SELECT id FROM public.hospital_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Hospitals can insert jobs" ON public.jobs
    FOR INSERT WITH CHECK (
        hospital_id IN (
            SELECT id FROM public.hospital_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Hospitals can update their own jobs" ON public.jobs
    FOR UPDATE USING (
        hospital_id IN (
            SELECT id FROM public.hospital_profiles WHERE user_id = auth.uid()
        )
    );

-- Applications policies
CREATE POLICY "Doctors can view their own applications" ON public.applications
    FOR SELECT USING (
        doctor_id IN (
            SELECT id FROM public.doctor_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Hospitals can view applications to their jobs" ON public.applications
    FOR SELECT USING (
        job_id IN (
            SELECT j.id FROM public.jobs j
            JOIN public.hospital_profiles hp ON j.hospital_id = hp.id
            WHERE hp.user_id = auth.uid()
        )
    );

CREATE POLICY "Doctors can insert applications" ON public.applications
    FOR INSERT WITH CHECK (
        doctor_id IN (
            SELECT id FROM public.doctor_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Hospitals can update application status" ON public.applications
    FOR UPDATE USING (
        job_id IN (
            SELECT j.id FROM public.jobs j
            JOIN public.hospital_profiles hp ON j.hospital_id = hp.id
            WHERE hp.user_id = auth.uid()
        )
    );

-- Messages policies
CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_doctor_profiles_updated_at BEFORE UPDATE ON public.doctor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hospital_profiles_updated_at BEFORE UPDATE ON public.hospital_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'doctor')::user_role,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
