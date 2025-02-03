module.exports = {
    createSchool: {
        name: "required|string",
        location: "required|string",
        contactInfo: "required|string",
        capacity: "required|integer|min:1",
    },
};
