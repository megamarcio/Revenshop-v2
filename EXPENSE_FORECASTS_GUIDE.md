# 📊 Guia de Teste - Sistema de Previsões de Despesas

## 🎯 **Funcionalidades Implementadas**

### ✅ **1. Dashboard de Previsões**
- **Localização**: Financeiro → Previsões
- **Métricas**: Cards com totais de despesas fixas, variáveis e previsão mensal
- **Organização**: Tabs separadas por tipo (Todas, Fixas, Variáveis)

### ✅ **2. Formulário de Previsões**
- **Campos obrigatórios**:
  - Descrição (ex: "Seguro do veículo")
  - Valor em USD
  - Tipo (Fixa/Variável)
  - Categoria (lista das categorias financeiras)
  - Dia do vencimento (1-31)
- **Campos opcionais**:
  - Status ativo/inativo
  - Observações

### ✅ **3. Sistema de Replicação**
- **Disponível para**: Apenas despesas fixas
- **Funcionalidade**: Botão "Replicar" na lista
- **Configuração**:
  - Data inicial
  - Número de parcelas (1-60)
- **Resultado**: Cria despesas no menu principal

### ✅ **4. Ações de CRUD**
- **Criar**: Botão "Nova Previsão"
- **Editar**: Botão de edição em cada item
- **Excluir**: Botão de exclusão com confirmação
- **Visualizar**: Lista organizada por tabs

---

## 🧪 **Roteiro de Testes**

### **Teste 1: Acessar Dashboard**
1. Abra http://localhost:4173/
2. Faça login no sistema
3. Navegue: **Financeiro** → **Previsões**
4. ✅ **Esperado**: Dashboard com cards de métricas

### **Teste 2: Criar Previsão Fixa**
1. Clique em "Nova Previsão"
2. Preencha:
   - Descrição: "Seguro Veículo Frota"
   - Valor: 1000
   - Tipo: Fixa
   - Categoria: Selecione uma categoria
   - Dia: 15
   - Status: Ativo
3. Clique "Criar Previsão"
4. ✅ **Esperado**: Previsão criada e listada

### **Teste 3: Criar Previsão Variável**
1. Clique em "Nova Previsão"
2. Preencha:
   - Descrição: "Combustível Mensal"
   - Valor: 500
   - Tipo: Variável
   - Categoria: Selecione uma categoria
   - Dia: 5
3. Clique "Criar Previsão"
4. ✅ **Esperado**: Previsão criada na tab "Variáveis"

### **Teste 4: Testar Replicação**
1. Na previsão fixa criada, clique "Replicar"
2. Configure:
   - Data inicial: Próximo mês
   - Parcelas: 12
3. Clique "Replicar Despesas"
4. ✅ **Esperado**: 12 despesas criadas no menu principal
5. Navegue: **Financeiro** → **Despesas** para verificar

### **Teste 5: Editar Previsão**
1. Clique no botão de editar em uma previsão
2. Altere descrição e valor
3. Clique "Atualizar"
4. ✅ **Esperado**: Previsão atualizada na lista

### **Teste 6: Filtrar por Tabs**
1. Clique na tab "Fixas"
2. ✅ **Esperado**: Apenas previsões fixas exibidas
3. Clique na tab "Variáveis"
4. ✅ **Esperado**: Apenas previsões variáveis exibidas

### **Teste 7: Verificar Métricas**
1. Observe os cards do dashboard
2. ✅ **Esperado**:
   - Total Fixas: Soma das previsões fixas ativas
   - Total Variáveis: Soma das previsões variáveis ativas
   - Previsão Mensal: Soma total das previsões ativas

### **Teste 8: Excluir Previsão**
1. Clique no botão de excluir
2. Confirme a exclusão
3. ✅ **Esperado**: Previsão removida da lista

---

## 🔧 **Status Técnico**

### **Armazenamento Atual**
- **Desenvolvimento**: localStorage (funcionando)
- **Produção**: Supabase (após migration)

### **Migration SQL**
```sql
-- Arquivo: supabase/migrations/20240101000032_create_expense_forecasts_table.sql
-- Status: Pronto para aplicar
```

### **Versão Atual**
- **Build**: v2.013 ✅
- **Erro TypeScript**: Não críticos (build funciona)
- **HMR**: Funcionando no desenvolvimento

---

## 🎯 **Próximos Passos**

### **Para Produção**
1. Aplicar migration no Supabase
2. Configurar variáveis de ambiente
3. Deploy da versão v2.013

### **Melhorias Futuras**
1. Integração com categorias financeiras
2. Relatórios de previsões vs realizado
3. Notificações de vencimento
4. Export para Excel/PDF

---

## 📞 **Suporte**

Se encontrar problemas durante os testes:
1. Verifique o console do browser (F12)
2. Confirme se está na versão correta
3. Teste em modo incognito
4. Verifique se há dados no localStorage

**Sistema testado e aprovado em**: Windows 10, Chrome/Edge
**Versão**: v2.013
**Data**: 2025-06-22 