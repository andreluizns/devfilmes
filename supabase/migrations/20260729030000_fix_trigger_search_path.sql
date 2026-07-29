-- O role supabase_auth_admin (usado pelo GoTrue ao inserir em auth.users)
-- roda com search_path=auth. Como handle_new_user() não qualificava o
-- schema, "insert into profiles" nunca resolvia para public.profiles
-- durante o signup real — falhava com "relation does not exist" e o
-- "exception when others" engolia o erro silenciosamente, então nenhuma
-- linha de profile era criada (e city/state nunca eram salvos).

create or replace function "public"."handle_new_user"() returns trigger
    language plpgsql security definer
    set search_path = public
    as $$
begin
  insert into public.profiles (id, name, city, state)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'state'
  )
  on conflict (id) do nothing;
  return new;
exception when others then
  return new;
end;
$$;
