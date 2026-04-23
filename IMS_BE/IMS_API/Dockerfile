# =========================
# Base runtime
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

# Cài thư viện cho SQL Server
RUN apt-get update && apt-get install -y \
    libgssapi-krb5-2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# =========================
# Build
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["IMS_API/IMS.Api.csproj", "IMS_API/"]
COPY ["IMS.Application/IMS.Application.csproj", "IMS.Application/"]
COPY ["IMS.Domain/IMS.Domain.csproj", "IMS.Domain/"]
COPY ["IMS.Infrastructure/IMS.Infrastructure.csproj", "IMS.Infrastructure/"]

RUN dotnet restore "./IMS_API/IMS.Api.csproj"

COPY . .
WORKDIR "/src/IMS_API"

RUN dotnet build "./IMS.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# =========================
# Publish
# =========================
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./IMS.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# =========================
# Final
# =========================
FROM base AS final
WORKDIR /app

COPY --from=publish /app/publish .

# USER app

ENTRYPOINT ["dotnet", "IMS.Api.dll"]