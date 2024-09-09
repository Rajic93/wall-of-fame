import {createClient, Provider} from "@supabase/supabase-js";

const url = 'https://wodkppbeygjjwongnfph.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvZGtwcGJleWdqandvbmduZnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0OTAyNzEsImV4cCI6MjA0MTA2NjI3MX0.jGXyntyrtgapP4FR8HU7jQ_rW1xTPw_GG7lBaBfa9ZM';
const supabase = createClient(url, key)

export const authenticateUser = (provider: Provider) => supabase.auth.signInWithOAuth({ provider });

export default supabase;
