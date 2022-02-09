CREATE PROCEDURE [dbo].[SProc_Rename_TableName]
@OldTableName NVARCHAR(4000)
,@NewTableName NVARCHAR(4000)
AS
BEGIN
DECLARE @SQLString NVARCHAR(4000)
DECLARE @TableName NVARCHAR(4000)
SELECT @TableName =CONVERT(nvarchar(255),@NewTableName) COLLATE DATABASE_DEFAULT 
 SET @SQLString='sp_rename ['+@OldTableName+'] , ['+@TableName+']'
EXEC (@SQLString)
END
go
CREATE PROCEDURE [dbo].[SProc_Rename_ColumnName]
 @TableName    NVARCHAR(4000)
,@OldColumnName NVARCHAR(4000)
,@NewColumnName NVARCHAR(4000)
	AS
BEGIN
	DECLARE @UNEWColumnName NVARCHAR(4000)
	DECLARE @SQLString NVARCHAR(4000)
	SELECT @UNEWColumnName =CONVERT(nvarchar(255),@NewColumnName) COLLATE DATABASE_DEFAULT 
	SET @SQLString='sp_rename ''['+@TableName+'].['+@OldColumnName+']'' , '''+@UNEWColumnName+''',''COLUMN'''
	EXEC (@SQLString)
	END
go
IF OBJECT_ID('SProc_Rename_ColumnName') IS NOT NULL DROP PROCEDURE SProc_Rename_ColumnName
go
IF OBJECT_ID('SProc_Rename_TableName') IS NOT NULL DROP PROCEDURE SProc_Rename_TableName
go
