export default function getTotalTicketsSelected(batches) {
    return batches.reduce((total, batch) => total + batch.quantitySelected, 0);
}