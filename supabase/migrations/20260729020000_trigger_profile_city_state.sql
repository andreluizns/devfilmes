-- Passa a gravar city/state (enviados via options.data no supabase.auth.signUp)
-- direto no trigger de criação de perfil, eliminando o round-trip de UPDATE
-- que o client fazia depois do signUp.

create or replace function "public"."handle_new_user"() returns trigger
    language plpgsql security definer
    as $$
begin
  insert into profiles (id, name, city, state)
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
