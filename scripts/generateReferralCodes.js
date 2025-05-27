const { createClient } = require('@supabase/supabase-js');
const { nanoid } = require('nanoid');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, referral_code');

  if (error) throw error;

  let updated = 0;
  for (const user of users) {
    if (!user.referral_code) {
      const code = nanoid(6);
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ referral_code: code })
        .eq('id', user.id);
      if (updateError) {
        console.error(`Failed to set code for user ${user.id}:`, updateError.message);
      } else {
        updated++;
        console.log(`Set referral code for user ${user.id}: ${code}`);
      }
    }
  }
  console.log(`Done. Updated ${updated} users.`);
}

main().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
}); 