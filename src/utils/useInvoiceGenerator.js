import { ref } from "vue";
import { jsPDF } from "jspdf";
import moment from "moment";

export function useInvoiceGenerator() {
    const isLoading = ref(false);
    const error = ref(null);

    const generateInvoicePDF = async (orderData) => {
        try {
            isLoading.value = true;
            error.value = null;

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 18;
            const lineHeight = 7;
            let y = margin;

            // Cores
            const primary = [50, 187, 120];    // verde mais agradável
            const dark = [44, 62, 80];
            const gray = [120, 120, 120];
            const orange = [255, 144, 54];     // para pendente
            const red = [220, 53, 69];          // para cancelado

            // Helpers
            const formatAmount = (amount) =>
                new Intl.NumberFormat("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(Number(amount || 0));

            const getPaymentMethod = (method) => {
                const map = {
                    reference: "Referência Multicaixa",
                    mul: "Multicaixa Express",
                    paypay: "PayPay",
                    cash: "Dinheiro",
                };
                return map[method] || method;
            };

            const getStatusInfo = (status) => {
                const map = {
                    'a': { text: 'PAGO', color: primary },
                    'p': { text: 'PENDENTE', color: orange },
                    'c': { text: 'CANCELADO', color: red }
                };
                return map[status] || { text: status?.toUpperCase() || 'DESCONHECIDO', color: gray };
            };

            // Cabeçalho
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(...primary);
            doc.text("PIWETO", margin, y + 8);

            doc.setFontSize(15);
            doc.setTextColor(...dark);
            doc.text(`FACTURA Nº ${orderData.id}`, pageWidth - margin, y + 8, { align: "right" });

            y += 22;

            // STATUS DO PEDIDO - Nova seção
            const statusInfo = getStatusInfo(orderData.status);
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...statusInfo.color);
            
            // Adiciona um fundo suave para o status
            doc.setFillColor(...statusInfo.color.map(c => Math.min(c + 200, 255))); // versão mais clara da cor
            doc.roundedRect(margin, y - 6, pageWidth - margin * 2, 10, 2, 2, 'F');
            
            doc.setTextColor(...statusInfo.color);
            doc.text(`STATUS: ${statusInfo.text}`, pageWidth / 2, y, { align: "center" });
            
            y += 16;

            // EVENTO
            doc.setFontSize(13);
            doc.setTextColor(...primary);
            doc.text("EVENTO", margin, y);
            y += lineHeight;

            doc.setFontSize(10);
            doc.setTextColor(...dark);
            doc.setFont("helvetica", "normal");

            doc.text(`Nome: ${orderData.event.name}`, margin + 4, y);
            y += lineHeight;

            const eventDate = moment(orderData.event.starts_at.date).format("DD/MM/YYYY");
            const eventTime = moment(orderData.event.starts_at.hm).format("HH:mm");
            doc.text(`Data: ${eventDate} às ${eventTime}`, margin + 4, y);
            y += lineHeight;

            const locText = `Local: ${orderData.event.address.location}`;
            const locLines = doc.splitTextToSize(locText, pageWidth - margin * 2 - 8);
            doc.text(locLines, margin + 4, y);
            y += locLines.length * lineHeight + 6;

            // CLIENTE
            doc.setFontSize(13);
            doc.setTextColor(...primary);
            doc.text("CLIENTE", margin, y);
            y += lineHeight;

            doc.setFontSize(10);
            doc.setTextColor(...dark);

            doc.text(`Nome: ${orderData.data.full_name}`, margin + 4, y);
            y += lineHeight;
            doc.text(`Telefone: ${orderData.data.phone}`, margin + 4, y);
            y += lineHeight;

            if (orderData.data.email) {
                doc.text(`Email: ${orderData.data.email}`, margin + 4, y);
                y += lineHeight;
            }
            y += 8;

            // TABELA DE INGRESSOS ────────────────────────────────
            doc.setFontSize(13);
            doc.setTextColor(...primary);
            doc.text("INGRESSOS", margin, y);
            y += lineHeight + 4;

            // Colunas (proporções mais equilibradas)
            const colDesc = margin;             // início
            const colQty = margin + 92;         // Quantidade
            const colPrice = margin + 125;      // Preço unitário
            const colTotal = margin + 165;      // Total
            const tableRight = pageWidth - margin;

            // Cabeçalho da tabela
            doc.setFillColor(...primary);
            doc.rect(margin, y - 5, tableRight - margin, 8, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);

            doc.text("Área", colDesc + 4, y + 1);
            doc.text("Qtd", colQty + 2, y + 1, { align: "center" });
            doc.text("Preço", colPrice + 2, y + 1, { align: "right" });
            doc.text("Total", colTotal + 2, y + 1, { align: "right" });

            y += 10;

            // Linhas de dados
            doc.setTextColor(...dark);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);

            orderData.batches.forEach((batch) => {
                if (y > 240) {
                    doc.addPage();
                    y = margin + 10;
                }

                const qty = batch.quantitySelected || 1;
                const total = batch.price * qty;

                const descLines = doc.splitTextToSize(batch.name, 88);
                const rowHeight = Math.max(descLines.length * 5.5, 8);

                // Bordas finas cinza claro
                doc.setDrawColor(220, 220, 220);
                doc.setLineWidth(0.15);

                doc.rect(colDesc, y - 4, colQty - colDesc - 2, rowHeight + 2);
                doc.rect(colQty - 2, y - 4, colPrice - colQty + 2, rowHeight + 2);
                doc.rect(colPrice - 2, y - 4, colTotal - colPrice + 2, rowHeight + 2);
                doc.rect(colTotal - 2, y - 4, tableRight - colTotal + 2, rowHeight + 2);

                // Conteúdo
                doc.text(descLines, colDesc + 4, y + 1);
                doc.text(qty.toString(), colQty + 2, y + 1, { align: "center" });
                doc.text(formatAmount(batch.price), colPrice + 2, y + 1, { align: "right" });
                doc.text(formatAmount(total), colTotal + 2, y + 1, { align: "right" });

                y += rowHeight + 3;
            });

            y += 6;

            // TOTAL
            doc.setDrawColor(...primary);
            doc.setLineWidth(0.4);
            doc.line(margin, y - 2, tableRight, y - 2);

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...primary);
            doc.text("TOTAL A PAGAR", colPrice - 10, y + 2);
            doc.text(formatAmount(orderData.amount), colTotal + 2, y + 2, { align: "right" });

            y += 18;

            // PAGAMENTO
            doc.setFontSize(13);
            doc.setTextColor(...primary);
            doc.text("PAGAMENTO", margin, y);
            y += lineHeight;

            doc.setFontSize(10);
            doc.setTextColor(...dark);
            doc.setFont("helvetica", "normal");

            doc.text(`Método: ${getPaymentMethod(orderData.data.payment_method)}`, margin + 4, y);
            y += lineHeight;
            doc.text(`Nº Reserva: ${orderData.reservation_number}`, margin + 4, y);
            y += lineHeight;

            // Mostra informações adicionais baseadas no status
            if (orderData.status === 'a') {
                doc.setTextColor(...primary);
                doc.setFont("helvetica", "bold");
                doc.text("✓ Pagamento confirmado", margin + 4, y);
                y += lineHeight;
                doc.setFont("helvetica", "normal");
                doc.setTextColor(...dark);
            } else if (orderData.status === 'p') {
                if (orderData.data.payment_method === "reference" && orderData.biz_content) {
                    doc.text(`Entidade: ${orderData.biz_content.entity_id}`, margin + 4, y);
                    y += lineHeight;
                    doc.text(`Referência: ${orderData.biz_content.reference_id}`, margin + 4, y);
                    y += lineHeight;
                }

                if (orderData.expires_at) {
                    const expires = moment(orderData.expires_at).format("DD/MM/YYYY HH:mm");
                    doc.text(`Válido até: ${expires}`, margin + 4, y);
                    y += lineHeight;
                }
                
                doc.setTextColor(...orange);
                doc.setFont("helvetica", "bold");
                doc.text("⏱ Aguardando pagamento", margin + 4, y);
                y += lineHeight;
                doc.setFont("helvetica", "normal");
                doc.setTextColor(...dark);
            } else if (orderData.status === 'c') {
                doc.setTextColor(...red);
                doc.setFont("helvetica", "bold");
                doc.text("✗ Pedido cancelado", margin + 4, y);
                y += lineHeight;
                doc.setFont("helvetica", "normal");
                doc.setTextColor(...dark);
            }

            // Rodapé
            const footerY = 272;
            doc.setFontSize(8);
            doc.setTextColor(...gray);
            doc.setFont("helvetica", "italic");

            doc.text("Este documento serve como comprovativo da sua reserva.", margin, footerY);
            doc.text("Contactos: 948 360 831  •  WhatsApp", margin, footerY + 5);
            doc.text(`Gerado em: ${moment().format("DD/MM/YYYY HH:mm")}`, margin, footerY + 10);

            // Nome do ficheiro
            const statusPrefix = orderData.status === 'a' ? 'paga' : 
                               orderData.status === 'p' ? 'pendente' : 
                               orderData.status === 'c' ? 'cancelada' : 'factura';
            const fileName = `factura_${statusPrefix}_${orderData.id}_${orderData.data.full_name.replace(/\s+/g, "_")}.pdf`;
            doc.save(fileName);

        } catch (err) {
            error.value = "Erro ao gerar a factura";
            console.error("Erro ao gerar PDF:", err);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        error,
        generateInvoicePDF,
    };
}