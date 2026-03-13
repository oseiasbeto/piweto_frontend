import { ref } from "vue";
import { jsPDF } from "jspdf";
import moment from "moment";

export function useAccessCredentialGenerator() {
    const isLoading = ref(false);
    const error = ref(null);

    const generateAccessCredentialPDF = async (orderData) => {
        try {
            isLoading.value = true;
            error.value = null;

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;
            let y = margin + 10;

            // Helper para centralizar
            const centerX = (text) => (pageWidth - doc.getTextWidth(text)) / 2;

            // Título
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(0, 0, 0);
            doc.text("CREDENCIAIS", centerX("CREDENCIAIS"), y);
            y += 20;

            // Evento
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(60, 60, 60);
            doc.text(orderData.event.name.toUpperCase(), centerX(orderData.event.name.toUpperCase()), y);
            y += 10;

            // Data
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(100, 100, 100);
            const eventDate = moment(orderData.event.starts_at.date).format("DD/MM/YYYY");
            const eventTime = moment(orderData.event.starts_at.hm).format("HH:mm");
            doc.text(`${eventDate} • ${eventTime}`, centerX(`${eventDate} • ${eventTime}`), y);
            y += 25;

            // ID da Reserva
            doc.setFontSize(10);
            doc.setTextColor(120, 120, 120);
            doc.text("ID DA RESERVA", centerX("ID DA RESERVA"), y);
            y += 8;
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.setTextColor(0, 0, 0);
            doc.text(orderData.id.toString(), centerX(orderData.id.toString()), y);
            y += 20;

            // PIN
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(120, 120, 120);
            doc.text("PIN DE ACESSO", centerX("PIN DE ACESSO"), y);
            y += 8;
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(28);
            doc.setTextColor(0, 0, 0);
            doc.text(orderData?.pin?.toString() || "----", centerX(orderData?.pin?.toString() || "----"), y);
            y += 20;

            // URL de autenticação
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(120, 120, 120); // Mesma cor das legendas
            
            const urlText = "Use para autenticar em:";
            const urlLink = `https://www.piweto.it.ao/reserva?id=${orderData?.id}&pin=${orderData?.pin}`;
            
            doc.text(urlText, centerX(urlText), y);
            y += 6;
            
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 150, 0); // Verde
            doc.text(urlLink, centerX(urlLink), y);
            y += 15;

            // Instrução adicional
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text("Credenciais pessoais e intransferíveis.", centerX("Credenciais pessoais e intransferíveis."), y);
            y += 15;

            // Rodapé
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("PIWETO • Dúvidas? WhatsApp: 948 360 831", centerX("PIWETO • Dúvidas? WhatsApp: 948 360 831"), 270);
            doc.text(`Gerado em: ${moment().format("DD/MM/YYYY HH:mm")}`, centerX(`Gerado em: ${moment().format("DD/MM/YYYY HH:mm")}`), 278);

            // Nome do arquivo
            const fileName = `credenciais_${orderData.id}.pdf`;
            doc.save(fileName);

        } catch (err) {
            error.value = "Erro ao gerar credencial";
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        error,
        generateAccessCredentialPDF,
    };
}