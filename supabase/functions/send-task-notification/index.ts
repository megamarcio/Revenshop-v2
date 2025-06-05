
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TaskNotificationRequest {
  taskId: string;
  taskTitle: string;
  assigneeId: string;
  creatorName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taskId, taskTitle, assigneeId, creatorName }: TaskNotificationRequest = await req.json();

    // Buscar email do usuário atribuído
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: assignee, error } = await supabaseClient
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('id', assigneeId)
      .single();

    if (error || !assignee) {
      throw new Error('Usuário não encontrado');
    }

    const emailResponse = await resend.emails.send({
      from: "Sistema de Tarefas <onboarding@resend.dev>",
      to: [assignee.email],
      subject: `Nova tarefa atribuída: ${taskTitle}`,
      html: `
        <h1>Nova Tarefa Atribuída</h1>
        <p>Olá ${assignee.first_name},</p>
        <p>Uma nova tarefa foi atribuída a você por <strong>${creatorName}</strong>:</p>
        <h2>${taskTitle}</h2>
        <p>Acesse o sistema para visualizar os detalhes e gerenciar esta tarefa.</p>
        <p>Atenciosamente,<br>Sistema de Gestão</p>
      `,
    });

    console.log("Email enviado com sucesso:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
