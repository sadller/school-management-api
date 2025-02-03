module.exports = class School { 

    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators;
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.schoolsCollection   = "schools";
        
        // Expose CRUD operations
        this.httpExposed = ['post=createSchool', 'get=getAllSchools', 'get=getSchoolById', 'put=updateSchool', 'delete=deleteSchool'];
    }

    async createSchool({ name, location, contactInfo, capacity }) {
        const school = { name, location, contactInfo, capacity };

        // Validate input
        let result = await this.validators.school.createSchool(school);
        if (result) return result;

        // Save to database (MongoDB)
        const newSchool = new this.mongomodels.School(school);
        await newSchool.save();

        return { school: newSchool };
    }

    async getAllSchools() {
        return await this.mongomodels.School.find();
    }
    

    async getSchoolById({ schoolId }) {
        return await this.mongomodels.School.findById(schoolId);
    }

    async updateSchool({ schoolId, updates }) {
        return await this.mongomodels.School.findByIdAndUpdate(schoolId, updates, { new: true });
    }

    async deleteSchool({ schoolId }) {
        return await this.mongomodels.School.findByIdAndDelete(schoolId);
    }
};
