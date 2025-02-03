module.exports = class Student { 

    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators;
        this.mongomodels         = mongomodels;
        this.studentsCollection  = "students";
        
        this.studentExposed = ['post=createStudent', 'get=getAllStudents', 'get=getStudentById', 'put=updateStudent', 'delete=deleteStudent'];
    }

    async createStudent({ name, enrollmentDate, classroomId }) {
        const student = { name, enrollmentDate, classroomId };

        let result = await this.validators.student.createStudent(student);
        if (result) return result;

        const newStudent = new this.mongomodels.Student(student);
        await newStudent.save();

        return { student: newStudent };
    }

    async getAllStudents() {
        return await this.mongomodels.Student.find();
    }

    async getStudentById({ studentId }) {
        return await this.mongomodels.Student.findById(studentId);
    }

    async updateStudent({ studentId, updates }) {
        return await this.mongomodels.Student.findByIdAndUpdate(studentId, updates, { new: true });
    }

    async deleteStudent({ studentId }) {
        return await this.mongomodels.Student.findByIdAndDelete(studentId);
    }
};
