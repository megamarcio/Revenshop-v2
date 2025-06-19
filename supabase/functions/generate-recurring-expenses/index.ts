
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Database {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string;
          description: string;
          amount: number;
          category_id: string | null;
          type: string;
          date: string;
          due_date: string;
          is_paid: boolean;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          is_recurring: boolean;
          recurring_interval: number | null;
          recurring_start_date: string | null;
          recurring_end_date: string | null;
          parent_expense_id: string | null;
          is_active_recurring: boolean;
        };
        Insert: {
          description: string;
          amount: number;
          category_id?: string | null;
          type: string;
          date: string;
          due_date: string;
          is_paid?: boolean;
          notes?: string | null;
          created_by?: string | null;
          is_recurring?: boolean;
          recurring_interval?: number | null;
          recurring_start_date?: string | null;
          recurring_end_date?: string | null;
          parent_expense_id?: string | null;
          is_active_recurring?: boolean;
        };
      };
    };
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting recurring expenses generation process...');

    // Buscar todas as despesas fixas ativas
    const { data: recurringExpenses, error: fetchError } = await supabaseClient
      .from('expenses')
      .select('*')
      .eq('is_recurring', true)
      .eq('is_active_recurring', true)
      .is('parent_expense_id', null);

    if (fetchError) {
      console.error('Error fetching recurring expenses:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${recurringExpenses?.length || 0} active recurring expenses`);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const expensesToGenerate = [];

    for (const expense of recurringExpenses || []) {
      const startDate = new Date(expense.recurring_start_date || expense.due_date);
      const endDate = expense.recurring_end_date ? new Date(expense.recurring_end_date) : null;
      const interval = expense.recurring_interval || 1;

      // Calcular se devemos gerar uma despesa para este mês
      const monthsSinceStart = (currentYear - startDate.getFullYear()) * 12 + (currentMonth - startDate.getMonth());
      
      // Verificar se é hora de gerar uma nova despesa baseada no intervalo
      if (monthsSinceStart >= 0 && monthsSinceStart % interval === 0) {
        // Verificar se não passou da data de fim (se definida)
        if (endDate && now > endDate) {
          console.log(`Expense ${expense.id} has passed end date, skipping`);
          continue;
        }

        // Calcular a data de vencimento para este mês
        const dueDate = new Date(currentYear, currentMonth, startDate.getDate());
        const dueDateString = dueDate.toISOString().split('T')[0];

        // Verificar se já existe uma despesa gerada para este mês
        const { data: existingExpense, error: checkError } = await supabaseClient
          .from('expenses')
          .select('id')
          .eq('parent_expense_id', expense.id)
          .eq('due_date', dueDateString)
          .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error checking existing expense:', checkError);
          continue;
        }

        if (existingExpense) {
          console.log(`Expense for ${dueDateString} already exists for recurring expense ${expense.id}`);
          continue;
        }

        // Preparar dados para nova despesa
        const newExpense = {
          description: expense.description,
          amount: expense.amount,
          category_id: expense.category_id,
          type: expense.type,
          date: dueDateString,
          due_date: dueDateString,
          is_paid: false,
          notes: `${expense.notes || ''} (Gerada automaticamente)`.trim(),
          created_by: expense.created_by,
          is_recurring: false,
          parent_expense_id: expense.id,
          is_active_recurring: true,
        };

        expensesToGenerate.push(newExpense);
      }
    }

    console.log(`Generating ${expensesToGenerate.length} new expenses`);

    if (expensesToGenerate.length > 0) {
      const { data: generatedExpenses, error: insertError } = await supabaseClient
        .from('expenses')
        .insert(expensesToGenerate)
        .select('*');

      if (insertError) {
        console.error('Error inserting generated expenses:', insertError);
        throw insertError;
      }

      console.log(`Successfully generated ${generatedExpenses?.length || 0} expenses`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Generated ${expensesToGenerate.length} recurring expenses`,
        generated: expensesToGenerate.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in generate-recurring-expenses function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
