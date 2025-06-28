# Guia de Importação SunPass

## Visão Geral

O sistema de pedágios do REVENSHOP agora suporta importação direta de arquivos de extrato do **SunPass**, o sistema oficial de pedágios da Flórida (EUA). Esta funcionalidade permite conciliar automaticamente os gastos com pedágios dos veículos da frota.

## Sobre o SunPass

- **Website oficial**: http://www.sunpass.com/
- **Região**: Flórida, Estados Unidos
- **Tipo**: Sistema de cobrança eletrônica de pedágios
- **Formato de arquivo**: CSV com separação por TAB

## Formato do Arquivo SunPass

### Estrutura das Colunas

O arquivo de extrato do SunPass contém as seguintes colunas (separadas por TAB):

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| **POSTED DATE** | Data de lançamento | 6/22/2025 |
| **TRANSACTION DATE** | Data da transação | 6/22/2025 |
| **TRANSACTION TIME** | Hora da transação | 3:16:01 PM |
| **TRANSACTION NUMBER** | Número da transação | 4508309810 |
| **TRANSPONDER/LICENSE PLATE** | Tag/Placa do veículo | 1.29143E+11 Florida Turnpike Enterprise |
| **AGENCY NAME** | Nome da agência/operadora | Florida Turnpike Enterprise |
| **LANE** | Número da pista | 60S |
| **AXLE** | Número de eixos | 2 |
| **DESCRIPTION / PLAZA NAME** | Descrição/Nome da praça | SR91 THREE LAKES MAIN SB MP236 |
| **DEBIT(-)** | Valor do débito | $4.13 |
| **CREDIT(+)** | Valor do crédito | $106.80 |
| **BALANCE** | Saldo da conta | $110.93 |

### Exemplo de Arquivo

```
POSTED DATE	TRANSACTION DATE	TRANSACTION TIME	TRANSACTION NUMBER	TRANSPONDER/LICENSE PLATE	AGENCY NAME	LANE	AXLE	DESCRIPTION / PLAZA NAME	DEBIT(-)	CREDIT(+)	BALANCE
6/22/2025	6/22/2025	3:16:01 PM	4508309810	1.29143E+11 Florida Turnpike Enterprise	60S	2	SR91 THREE LAKES MAIN SB MP236	$4.13		$106.80
6/22/2025	6/22/2025	2:16:34 PM	4508250508	7514690110 Florida Turnpike Enterprise	10	2	SR417 OSCEOLA PKWY NB MP7	$0.56		$110.93
6/22/2025	6/22/2025	1:49:30 PM	4508250681	6073931010 Florida Turnpike Enterprise	2S	2	SR528 BCHLINE WEST MAIN WB MP6	$2.17		$111.51
```

## Como Importar

### 1. Acessar o Sistema
- Navegue até **Rental Car > Pedágios**
- Clique na aba **"Importar CSV"**

### 2. Selecionar Formato
- Escolha **"SunPass"** na seção "Formato de Importação"
- O sistema mostrará informações específicas sobre o formato

### 3. Baixar Template (Opcional)
- Clique em **"Baixar Template SunPass"** para ver um exemplo do formato
- Use este template como referência

### 4. Fazer Upload
- Arraste o arquivo CSV do SunPass para a área de upload
- Ou clique para selecionar o arquivo manualmente
- O sistema processará automaticamente o arquivo

### 5. Revisar Preview
- Verifique os dados importados na tabela de preview
- Confirme se as informações estão corretas
- O sistema mostra até 10 registros para verificação

### 6. Importar
- Clique em **"Importar Registros"** para processar todos os dados
- O sistema associará automaticamente os pedágios aos veículos cadastrados

## Processamento Automático

### Mapeamento de Dados

O sistema faz o mapeamento automático dos campos do SunPass:

- **Placa**: Extraída do campo `TRANSPONDER/LICENSE PLATE`
- **Tag**: Campo completo `TRANSPONDER/LICENSE PLATE`
- **Local**: Campo `DESCRIPTION / PLAZA NAME`
- **Valor**: Campo `DEBIT(-)` (convertido para valor positivo)
- **Data**: Combinação de `TRANSACTION DATE` + `TRANSACTION TIME`
- **Transação**: Campo `TRANSACTION NUMBER`
- **Operadora**: Campo `AGENCY NAME` (padrão: "SunPass")
- **Pista**: Campo `LANE`
- **Classe**: Campo `AXLE` + " eixos"
- **Pagamento**: Sempre "TAG"

### Associação com Veículos

O sistema tenta associar automaticamente cada pedágio a um veículo:

1. **Por Placa**: Busca veículos com a placa extraída
2. **Por Tag**: Busca veículos com a tag correspondente
3. **Criação Automática**: Se não encontrar, cria um registro pendente

### Tratamento de Erros

- **Linhas inválidas**: Registradas no log de erros
- **Valores inválidos**: Convertidos para zero ou string vazia
- **Datas inválidas**: Mantidas como texto original
- **Associações perdidas**: Marcadas para revisão manual

## Funcionalidades Específicas

### Identificação de Formato
- Arquivos SunPass são identificados pelo prefixo `SUNPASS_`
- Histórico mostra badge específico para cada formato
- Estatísticas separadas por tipo de importação

### Parser Inteligente
- Reconhece separação por TAB (não vírgula)
- Extrai placas de campos complexos
- Converte valores monetários ($4.13 → 4.13)
- Combina data e hora em timestamp único

### Validação
- Verifica estrutura do arquivo
- Valida presença de colunas obrigatórias
- Detecta formato incorreto automaticamente

## Conciliação

Após a importação, os registros ficam disponíveis para conciliação:

### Busca por Veículo
- Selecione o veículo na lista
- Sistema mostra todos os pedágios associados

### Busca por Placa
- Digite a placa manualmente
- Formato: ABC-1234 ou ABC1234

### Busca por Tag
- Digite o número da tag
- Formato: números ou texto

### Filtros de Período
- Data/hora inicial e final
- Busca precisa por intervalo

## Histórico e Estatísticas

### Histórico de Importações
- Lista todas as importações SunPass
- Mostra estatísticas de sucesso/falha
- Identifica formato com badge específico

### Logs de Erro
- Registra erros por linha
- Facilita correção de problemas
- Permite reprocessamento

## Próximos Passos

### E-Pass (Em Desenvolvimento)
- Formato similar ao SunPass
- Suporte planejado para próxima versão
- Interface já preparada

### Melhorias Futuras
- Importação automática via API
- Notificações de novos pedágios
- Relatórios avançados de gastos
- Integração com sistema de combustível

## Suporte

Para dúvidas ou problemas:

1. Verifique o formato do arquivo
2. Use o template como referência
3. Consulte os logs de erro
4. Entre em contato com o suporte técnico

---

**Versão**: v2.028 - Sistema de Pedágios com Suporte SunPass
**Data**: 22/06/2025
**Autor**: REVENSHOP Development Team 