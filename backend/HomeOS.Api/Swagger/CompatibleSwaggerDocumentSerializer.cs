using Microsoft.OpenApi;
using Microsoft.OpenApi.Extensions;
using Microsoft.OpenApi.Writers;
using Swashbuckle.AspNetCore.Swagger;

namespace HomeOS.Api.Swagger;

public sealed class CompatibleSwaggerDocumentSerializer : ISwaggerDocumentSerializer
{
    public void SerializeDocument(
        Microsoft.OpenApi.Models.OpenApiDocument document,
        IOpenApiWriter writer,
        OpenApiSpecVersion specVersion)
    {
        var json = document.SerializeAsJson(specVersion);

        if (specVersion == OpenApiSpecVersion.OpenApi3_0)
        {
            json = json.Replace("\"openapi\": \"3.0.4\"", "\"openapi\": \"3.0.3\"", StringComparison.Ordinal);
        }

        writer.WriteRaw(json);
        writer.Flush();
    }
}