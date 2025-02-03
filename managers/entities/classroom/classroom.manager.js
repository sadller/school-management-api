module.exports = class Classroom { 

    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
        this.config                 = config;
        this.cortex                 = cortex;
        this.validators             = validators;
        this.mongomodels            = mongomodels;
        this.classroomsCollection   = "classrooms";
        
        this.classroomExposed = ['post=createClassroom', 'get=getAllClassrooms', 'get=getClassroomById', 'put=updateClassroom', 'delete=deleteClassroom'];
    }

    async createClassroom({ name, capacity, schoolId }) {
        const classroom = { name, capacity, schoolId };

        let result = await this.validators.classroom.createClassroom(classroom);
        if (result) return result;

        const newClassroom = new this.mongomodels.Classroom(classroom);
        await newClassroom.save();

        return { classroom: newClassroom };
    }

    async getAllClassrooms() {
        return await this.mongomodels.Classroom.find();
    }

    async getClassroomById({ classroomId }) {
        return await this.mongomodels.Classroom.findById(classroomId);
    }

    async updateClassroom({ classroomId, updates }) {
        return await this.mongomodels.Classroom.findByIdAndUpdate(classroomId, updates, { new: true });
    }

    async deleteClassroom({ classroomId }) {
        return await this.mongomodels.Classroom.findByIdAndDelete(classroomId);
    }
};
