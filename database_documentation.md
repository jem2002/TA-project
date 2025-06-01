# Parking Management System - Database Documentation

## Entity Relationship Diagram

```mermaid
erDiagram
    COMPANIES ||--o{ PARKINGS : owns
    COMPANIES ||--o{ USERS : employs
    PARKINGS ||--o{ PARKING_ZONES : contains
    PARKING_ZONES ||--o{ PARKING_SPACES : has
    PARKINGS ||--o{ TARIFAS : defines
    PARKINGS ||--o{ PLANES_ESPECIALES : offers
    VEHICLE_TYPES ||--o{ VEHICLES : categorizes
    VEHICLE_TYPES ||--o{ TARIFAS : applies_to
    VEHICLE_TYPES ||--o{ PLANES_ESPECIALES : applies_to
    USERS ||--o{ VEHICLES : owns
    USERS ||--o{ RESERVAS : makes
    USERS ||--o{ PARKING_SESSIONS : has
    USERS ||--o{ USER_PLANES : subscribes
    USERS ||--|| PUNTOS_FIDELIDAD : earns
    VEHICLES ||--o{ RESERVAS : used_in
    VEHICLES ||--o{ PARKING_SESSIONS : used_in
    VEHICLES ||--o{ USER_PLANES : registered_for
    PARKING_SPACES ||--o{ RESERVAS : reserved_for
    PARKING_SPACES ||--o{ PARKING_SESSIONS : occupied_by
    TARIFAS ||--o{ RESERVAS : priced_by
    TARIFAS ||--o{ PARKING_SESSIONS : charged_at
    PLANES_ESPECIALES ||--o{ USER_PLANES : template_for
    USER_PLANES ||--o{ RESERVAS : applied_to
    USER_PLANES ||--o{ PARKING_SESSIONS : applied_to
    RESERVAS ||--o{ PARKING_SESSIONS : results_in
    PUNTOS_FIDELIDAD ||--o{ PUNTOS_FIDELIDAD_TRANSACTIONS : records
    PARKING_SESSIONS ||--o{ PUNTOS_FIDELIDAD_TRANSACTIONS : generates
    PARKINGS ||--o{ DESCUENTOS : offers
    DESCUENTOS ||--o{ PARKING_SESSION_DISCOUNTS : applied_as
    PARKING_SESSIONS ||--o{ PARKING_SESSION_DISCOUNTS : receives
