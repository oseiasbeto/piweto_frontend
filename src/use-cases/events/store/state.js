export default {
    eventForm: {
        name: "",
        file: null,
        cover: null,
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
            province: "bengo",
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
    isUpdatedEvent: false,
    myEvents: {
        data: [],
        metadata: {},
        hasViewed: false
    }
}