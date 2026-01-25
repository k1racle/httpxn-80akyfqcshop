// ============================================
// ЖИЗНЕННЫЙ ЦИКЛ КАРТОЧКИ ИС v1.0
// ============================================
// Каждый статус определяет: текст, действия и деньги
// Нет данных → нет движения
// Порядок: S0 → S1 → S2 → S3 (без прыжков)

export type ListingStatusCode = 'S0' | 'S1' | 'S2' | 'S3';

export interface ListingStatus {
  code: ListingStatusCode;
  label: string;
  labelShort: string;
  description: string;
  canTransact: boolean;
  canEdit: boolean;
  showPrice: boolean;
  sortOrder: number;
}

// S0 — Ознакомительный
// Назначение: наполнение, навигация, демонстрация рынка
// Источник: демо / авто-ген / неполные данные
export const STATUS_S0: ListingStatus = {
  code: 'S0',
  label: 'Ознакомительный объект',
  labelShort: 'Ознакомительный',
  description: 'Не участвует в сделках',
  canTransact: false,
  canEdit: true,
  showPrice: false, // Цены не показываем для S0
  sortOrder: 4, // Показывается последним
};

// S1 — На проверке
// Назначение: фильтр легитимности
// Условие входа: заполнены ключевые поля + загружены документы
export const STATUS_S1: ListingStatus = {
  code: 'S1',
  label: 'На проверке',
  labelShort: 'На проверке',
  description: 'Ожидание верификации платформой',
  canTransact: false,
  canEdit: false,
  showPrice: true,
  sortOrder: 2,
};

// S2 — Доступен для сделки
// Назначение: монетизация
// Условие входа: проверка пройдена, статус прав понятен
export const STATUS_S2: ListingStatus = {
  code: 'S2',
  label: 'Доступен для сделки',
  labelShort: 'Доступен',
  description: 'Проверка пройдена, готов к транзакции',
  canTransact: true,
  canEdit: false,
  showPrice: true,
  sortOrder: 1, // Показывается первым
};

// S3 — Архив
// Назначение: история рынка
// Причины: объект продан / лицензия завершена / снят правообладателем
export const STATUS_S3: ListingStatus = {
  code: 'S3',
  label: 'Архив',
  labelShort: 'Архив',
  description: 'Объект снят с публикации',
  canTransact: false,
  canEdit: false,
  showPrice: false,
  sortOrder: 5, // Скрыт по умолчанию
};

// Маппинг всех статусов
export const LISTING_STATUSES: Record<ListingStatusCode, ListingStatus> = {
  S0: STATUS_S0,
  S1: STATUS_S1,
  S2: STATUS_S2,
  S3: STATUS_S3,
};

// Конвертация из старых статусов БД
export function mapDbStatusToCode(dbStatus: string, isDemo?: boolean): ListingStatusCode {
  if (isDemo) return 'S0';
  
  switch (dbStatus) {
    case 'published':
    case 'active':
      return 'S2';
    case 'pending':
    case 'reviewing':
      return 'S1';
    case 'sold':
    case 'cancelled':
    case 'rejected':
      return 'S3';
    default:
      return 'S0';
  }
}

// Получение полного объекта статуса
export function getListingStatus(dbStatus: string, isDemo?: boolean): ListingStatus {
  const code = mapDbStatusToCode(dbStatus, isDemo);
  return LISTING_STATUSES[code];
}

// Правила переходов (жёстко)
// S0 → S1 → S2 → S3
// ❌ Нет прыжков
// ❌ Нет обратных ходов без причины
// ❌ Нет сделки без S2
export const ALLOWED_TRANSITIONS: Record<ListingStatusCode, ListingStatusCode[]> = {
  S0: ['S1'], // Только вперед на проверку
  S1: ['S0', 'S2'], // Отказ или одобрение
  S2: ['S3', 'S1'], // В архив или снять с публикации
  S3: [], // Из архива нельзя выйти
};

export function canTransition(from: ListingStatusCode, to: ListingStatusCode): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}
