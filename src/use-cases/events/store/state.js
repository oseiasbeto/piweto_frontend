export default {
    eventForm: {
        name: "",
        file: null,
        category: "",
        description: "",
        showPreviewCover: true,
        status: "pending",
        batches: [],
        starts_at: {
            date: null,
            hm: null
        },
        ends_at: {
            date: null,
            hm: null
        },
        address: {
            location: "",
            street: "",
            neighborhood: "",
            city: "",
            estate: "Angola",
            number: "",
            complement: ""
        },
        meeting: {
            url: null,
            plataform: "zoom"
        },
        showOnMap: false,
        visibility: 'public',
        nameclature: "ticket"
    },
    event: {},
    myEvents: {
        data: [],
        metadata: {},
        hasViewed: false
    }
}