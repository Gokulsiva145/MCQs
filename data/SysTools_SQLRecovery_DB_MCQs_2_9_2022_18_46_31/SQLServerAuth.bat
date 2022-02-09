sqlcmd -U %1 -P %2 -S %3 -d %4 -i UserDefinedDatatypes.sql
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Courses_0.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Courses_1.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Courses_Constraint.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\CourseTypes_0.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\CourseTypes_1.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\CourseTypes_Constraint.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\ExamFor_0.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\ExamFor_1.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\ExamFor_Constraint.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\ExamQuestions_0.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\ExamQuestions_1.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\ExamQuestions_Constraint.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\QuestionTypes_0.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\QuestionTypes_1.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\QuestionTypes_Constraint.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Results_0.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Results_1.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Results_Constraint.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Schedules_0.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Schedules_1.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Schedules_Constraint.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Status_0.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Status_1.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Status_Constraint.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Students_0.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Students_1.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Students_Constraint.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Subjects_0.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Subjects_1.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Subjects_Constraint.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Users_0.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Users_1.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\Users_Constraint.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\UserTypes_0.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\UserTypes_1.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i "Tables\UserTypes_Constraint.sql"
sqlcmd -U %1 -P %2 -S %3 -d %4 -i foreignKey.sql
sqlcmd -U %1 -P %2 -S %3 -d %4 -i Temp_Stored_Procedure.sql
