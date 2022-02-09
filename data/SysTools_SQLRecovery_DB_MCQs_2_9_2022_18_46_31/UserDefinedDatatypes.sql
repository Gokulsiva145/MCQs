sp_addtype [sysname], 'nvarchar(128)' 
go
sp_addtype [hierarchyid], 'varbinary(892)' 
go
CREATE TYPE [geometry] FROM varbinary(max)
go
CREATE TYPE [geography] FROM varbinary(max)
go
