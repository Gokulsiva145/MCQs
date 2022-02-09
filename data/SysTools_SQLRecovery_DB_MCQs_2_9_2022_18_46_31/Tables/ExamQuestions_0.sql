CREATE TABLE [dbo].[ExamQuestions] ([Id] [int] NOT NULL,[exam_Id] [int],[questionNo] [int],[question] [nvarchar](max),[optionA] [nvarchar](50),[optionB] [nvarchar](50),[optionC] [nvarchar](50),[optionD] [nvarchar](50),[correctAnswer] [nvarchar](50),[mark] [float],[negativeMark] [float],[question_Type_Id] [int])

go
