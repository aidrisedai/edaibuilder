-- EdAIBuilder Platform Schema
-- This migration creates all core platform tables

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TEACHER CLASSES
-- ============================================
create table public.teacher_classes (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  class_code text unique not null,
  created_at timestamptz default now()
);

-- ============================================
-- USER PROFILES
-- ============================================
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) between 3 and 20),
  display_name text not null,
  grade_level integer check (grade_level between 6 and 12),
  role text not null default 'student' check (role in ('student', 'teacher')),
  teacher_id uuid references public.users(id) on delete set null,
  class_code text,
  founder_xp integer not null default 0,
  journal_entries_count integer not null default 0,
  created_at timestamptz default now(),
  last_active_at timestamptz default now()
);

-- ============================================
-- PROJECTS
-- ============================================
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  phase integer not null default 1 check (phase between 1 and 3),
  deploy_target text not null default 'github_pages' check (deploy_target in ('github_pages', 'render')),
  published_url text,
  github_repo_url text,
  supabase_schema_name text,
  step_index integer not null default 0,
  status text not null default 'drafting' check (status in ('drafting', 'building', 'deployed', 'error')),
  generated_html text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- CONVERSATIONS
-- ============================================
create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  messages jsonb not null default '[]'::jsonb,
  agent_node text,
  token_count integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- FOUNDER'S JOURNAL
-- ============================================
create table public.founder_journal (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  activity_type text not null check (activity_type in (
    'pivot_game', 'user_interview', 'first_10',
    'dollar_question', 'crash_test', 'feedback_loop'
  )),
  question text not null,
  answer text not null,
  ai_feedback text not null default '',
  xp_awarded integer not null default 0,
  created_at timestamptz default now()
);

-- ============================================
-- PROJECT FILES
-- ============================================
create table public.project_files (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  filename text not null,
  content text not null default '',
  file_version integer not null default 1,
  updated_at timestamptz default now(),
  unique(project_id, filename)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.conversations enable row level security;
alter table public.founder_journal enable row level security;
alter table public.project_files enable row level security;
alter table public.teacher_classes enable row level security;

-- Users: can read/update own profile; teachers can read their students
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Teachers can view their students"
  on public.users for select
  using (
    exists (
      select 1 from public.users t
      where t.id = auth.uid() and t.role = 'teacher'
      and public.users.teacher_id = t.id
    )
  );

-- Projects: users can CRUD their own projects; teachers can view student projects
create policy "Users can manage own projects"
  on public.projects for all
  using (auth.uid() = user_id);

create policy "Teachers can view student projects"
  on public.projects for select
  using (
    exists (
      select 1 from public.users s
      where s.id = public.projects.user_id
      and s.teacher_id = auth.uid()
    )
  );

-- Conversations: users can manage own conversations
create policy "Users can manage own conversations"
  on public.conversations for all
  using (auth.uid() = user_id);

-- Founder Journal: users can manage own entries
create policy "Users can manage own journal entries"
  on public.founder_journal for all
  using (auth.uid() = user_id);

-- Project Files: access through project ownership
create policy "Users can manage own project files"
  on public.project_files for all
  using (
    exists (
      select 1 from public.projects p
      where p.id = public.project_files.project_id
      and p.user_id = auth.uid()
    )
  );

-- Teacher Classes: teachers can manage their own classes
create policy "Teachers can manage own classes"
  on public.teacher_classes for all
  using (auth.uid() = teacher_id);

create policy "Anyone can read classes for signup"
  on public.teacher_classes for select
  using (true);

-- ============================================
-- INDEXES
-- ============================================
create index idx_projects_user_id on public.projects(user_id);
create index idx_conversations_project_id on public.conversations(project_id);
create index idx_founder_journal_user_id on public.founder_journal(user_id);
create index idx_founder_journal_project_id on public.founder_journal(project_id);
create index idx_project_files_project_id on public.project_files(project_id);
create index idx_users_teacher_id on public.users(teacher_id);
create index idx_users_class_code on public.users(class_code);
create index idx_teacher_classes_code on public.teacher_classes(class_code);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at();

create trigger conversations_updated_at
  before update on public.conversations
  for each row execute function public.update_updated_at();

-- Increment journal count and XP when journal entry is added
create or replace function public.on_journal_entry_created()
returns trigger as $$
begin
  update public.users
  set
    founder_xp = founder_xp + new.xp_awarded,
    journal_entries_count = journal_entries_count + 1
  where id = new.user_id;
  return new;
end;
$$ language plpgsql;

create trigger journal_entry_created
  after insert on public.founder_journal
  for each row execute function public.on_journal_entry_created();
