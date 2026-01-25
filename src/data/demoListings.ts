// Demo listings data - 500 items across 12 categories
// These are exploratory items, not real IP assets

export interface DemoListing {
  id: string;
  category: string;
  name: string;
  description: string;
  registration_number: string;
  price: number | null;
  price_negotiable: boolean;
  status: "demo";
  views_count: number;
  favorites_count: number;
  cart_count: number;
  is_demo: boolean;
  demo_label: string;
  legal_status: string;
  can_buy: boolean;
  created_at: string;
  user_id: string;
}

// Professional structured descriptions per category
const categoryDescriptions: Record<string, (name: string) => string> = {
  techpacks: (name) => `**Назначение**
Технологический пакет ${name} предназначен для комплексной автоматизации производственных и технологических процессов с применением современных методов управления и мониторинга.

**Функциональная архитектура**
Решение реализует модульную архитектуру и включает:
• модуль управления технологическими операциями (контроль параметров, автоматизация циклов, адаптивное регулирование);
• модуль интеграции с промышленным оборудованием через стандартные протоколы;
• модуль мониторинга и диагностики в реальном времени;
• аналитический модуль с отчётностью и KPI.

**Область применения**
Промышленные предприятия, производственные комплексы, инжиниринговые компании, R&D-подразделения.

**Правовой статус**
Объект относится к категории «Технологические пакеты». Карточка носит ознакомительный характер и предназначена для демонстрации структуры каталога. Не является предложением о продаже.`,

  "ai-models": (name) => `**Назначение**
Модель ИИ ${name} предназначена для решения задач интеллектуального анализа данных, прогнозирования и автоматизации принятия решений на основе алгоритмов машинного обучения.

**Функциональная архитектура**
Система включает следующие компоненты:
• ядро нейросетевой модели с оптимизированными гиперпараметрами;
• модуль предобработки и нормализации входных данных;
• модуль инференса с поддержкой batch и real-time режимов;
• API-интерфейс для интеграции в существующие системы;
• модуль мониторинга качества предсказаний.

**Область применения**
Финтех, ритейл, логистика, здравоохранение, промышленная аналитика, маркетинг.

**Правовой статус**
Объект относится к категории «Модели ИИ и алгоритмы». Карточка носит ознакомительный характер и предназначена для демонстрации структуры каталога. Не является предложением о продаже.`,

  software: (name) => `**Назначение**
Программный продукт ${name} предназначен для автоматизации бизнес-процессов и централизованного управления операционной деятельностью предприятия.

**Функциональная архитектура**
Система реализует модульную архитектуру и включает:
• модуль управления основными операциями (учёт, обработка, контроль);
• модуль маршрутизации и оптимизации процессов;
• модуль мониторинга и отслеживания в реальном времени;
• модуль интеграции с внешними платформами через API;
• аналитический модуль с отчётностью и KPI.

**Технологическая реализация**
Решение разработано с использованием серверной и клиентской логики, поддерживает масштабирование и интеграцию в IT-инфраструктуру предприятия.

**Область применения**
Корпоративные клиенты, дистрибьюторы, e-commerce, производственные предприятия.

**Правовой статус**
Объект относится к категории «Программы для ЭВМ». Карточка носит ознакомительный характер и предназначена для демонстрации структуры каталога. Не является предложением о продаже.`,

  datasets: (name) => `**Назначение**
Датасет ${name} представляет собой структурированную выборку данных для обучения моделей машинного обучения и проведения аналитических исследований.

**Структура данных**
Набор включает:
• основные признаки и метки для обучения с учителем;
• временные метки и идентификаторы для трекинга;
• категориальные и числовые атрибуты;
• метаданные о происхождении и качестве записей.

**Характеристики**
Данные прошли предобработку, очистку от выбросов и дубликатов, нормализацию и валидацию. Формат совместим с популярными ML-фреймворками.

**Область применения**
Data Science, аналитика, R&D-подразделения, академические исследования.

**Правовой статус**
Объект относится к категории «Датасеты и выборки». Карточка носит ознакомительный характер и предназначена для демонстрации структуры каталога. Не является предложением о продаже.`,

  patents: (name) => `**Назначение**
Патент на изобретение ${name} относится к области технических решений и может быть использован для повышения эффективности промышленных и технологических процессов.

**Техническое решение**
Изобретение обеспечивает:
• улучшенные эксплуатационные характеристики;
• повышение надёжности и снижение затрат;
• расширение функциональных возможностей;
• совместимость с существующими системами.

**Область применения**
Промышленность, телекоммуникации, IT-сектор, энергетика, транспорт.

**Правовой статус**
Объект относится к категории «Патенты на изобретения». Карточка носит ознакомительный характер и предназначена для демонстрации структуры каталога. Не является предложением о продаже и не отражает фактическую регистрацию прав.`,

  databases: (name) => `**Назначение**
База данных ${name} предназначена для структурированного хранения, обработки и анализа бизнес-информации с поддержкой сложных аналитических запросов.

**Архитектура**
Структура включает:
• оптимизированную схему с нормализацией данных;
• индексы для высокопроизводительного поиска;
• механизмы версионирования и аудита изменений;
• средства обеспечения целостности и консистентности.

**Технические характеристики**
Поддержка транзакций ACID, репликация, резервное копирование, интеграция через стандартные SQL/API интерфейсы.

**Область применения**
Корпоративные информационные системы, аналитика, CRM/ERP-решения.

**Правовой статус**
Объект относится к категории «Базы данных». Карточка носит ознакомительный характер и предназначена для демонстрации структуры каталога. Не является предложением о продаже.`,

  knowhow: (name) => `**Назначение**
Ноу-хау ${name} представляет собой конфиденциальную производственную методику, обеспечивающую конкурентное преимущество в отрасли.

**Содержание**
Документация включает:
• детализированное описание технологического процесса;
• параметры и режимы применения;
• спецификации материалов и оборудования;
• методики контроля качества;
• рекомендации по внедрению.

**Особенности**
Методика апробирована в производственных условиях и имеет подтверждённую эффективность.

**Область применения**
Производственные предприятия, технологические компании, лицензиаты.

**Правовой статус**
Объект относится к категории «Ноу-хау (секреты производства)». Карточка носит ознакомительный характер и предназначена для демонстрации структуры каталога. Не является предложением о продаже.`,

  specifications: (name) => `**Назначение**
Техспецификация ${name} содержит полное техническое описание продукта, системы или компонента для целей разработки, производства и интеграции.

**Содержание документации**
• функциональные и нефункциональные требования;
• архитектурные схемы и диаграммы;
• спецификации интерфейсов и протоколов;
• требования к производительности и надёжности;
• методики тестирования и приёмки.

**Формат**
Документация оформлена в соответствии с отраслевыми стандартами и готова к использованию в проектной деятельности.

**Область применения**
Инженерные подразделения, разработчики, интеграторы, подрядчики.

**Правовой статус**
Объект относится к категории «Техспецификации». Карточка носит ознакомительный характер и предназначена для демонстрации структуры каталога. Не является предложением о продаже.`,

  trademarks: (name) => `**Назначение**
Товарный знак ${name} предназначен для индивидуализации товаров и услуг, обеспечения узнаваемости бренда и защиты от недобросовестного использования.

**Состав объекта**
• словесное и/или изобразительное обозначение;
• цветовая схема и стилистика;
• описание классов МКТУ для регистрации;
• рекомендации по применению.

**Характеристики**
Обозначение разработано с учётом требований патентной экспертизы и готово к регистрации.

**Область применения**
Потребительские товары, услуги, e-commerce, франчайзинг.

**Правовой статус**
Объект относится к категории «Товарные знаки». Карточка носит ознакомительный характер и предназначена для демонстрации структуры каталога. Не является предложением о продаже и не отражает фактическую регистрацию прав.`,

  copyrights: (name) => `**Назначение**
Объект авторского права ${name} представляет собой охраняемое произведение, созданное в результате творческой деятельности.

**Состав объекта**
• исходные материалы произведения;
• техническая документация (при наличии);
• сведения об авторстве;
• условия использования и лицензирования.

**Характеристики**
Произведение является оригинальным и обладает признаками охраноспособности в соответствии с законодательством об авторском праве.

**Область применения**
Медиа, издательства, разработка контента, лицензирование.

**Правовой статус**
Объект относится к категории «Авторские права». Карточка носит ознакомительный характер и предназначена для демонстрации структуры каталога. Не является предложением о продаже.`,

  "digital-twins": (name) => `**Назначение**
Цифровой двойник ${name} представляет собой виртуальную модель физического объекта или процесса для симуляции, мониторинга и оптимизации.

**Функциональная архитектура**
Система включает:
• 3D-модель с параметрическими характеристиками;
• модуль синхронизации с реальным объектом;
• симуляционный движок для сценарного анализа;
• дашборды мониторинга и управления;
• API для интеграции с SCADA/IoT-системами.

**Область применения**
Промышленность, строительство, энергетика, транспорт, smart city.

**Правовой статус**
Объект относится к категории «Digital Twins». Карточка носит ознакомительный характер и предназначена для демонстрации структуры каталога. Не является предложением о продаже.`,

  prototypes: (name) => `**Назначение**
Прототип ${name} представляет собой результат научно-исследовательской и опытно-конструкторской работы, готовый к тестированию и доработке.

**Состав объекта**
• техническая документация и чертежи;
• описание конструкции и принципа работы;
• результаты испытаний и тестирования;
• рекомендации по доработке и масштабированию;
• оценка технико-экономической эффективности.

**Стадия готовности**
Прототип прошёл лабораторные испытания и готов к пилотному внедрению.

**Область применения**
R&D-подразделения, стартапы, венчурные инвесторы, технологические компании.

**Правовой статус**
Объект относится к категории «Прототипы и R&D». Карточка носит ознакомительный характер и предназначена для демонстрации структуры каталога. Не является предложением о продаже.`
};

// Category names and types
const categoryNames: Record<string, { type: string; names: string[] }> = {
  techpacks: {
    type: "Технологический пакет",
    names: [
      "«AquaFlow System»", "«ThermoGuard Pro»", "«NanoFilter Matrix»", "«BioSync Platform»",
      "«EcoProcess Suite»", "«SmartGrid Controller»", "«HydroTech Solutions»", "«CryoStore Module»",
      "«PlasmaPure System»", "«SolarMax Integration»", "«WindTech Optimizer»", "«GeoSense Array»",
      "«AtmoClean Technology»", "«WavePower Generator»", "«FusionCore Framework»", "«QuantumLink Hub»",
      "«NeuroBridge Protocol»", "«CarbonZero Process»", "«MicroScale Assembly»", "«OptiFlow Network»",
      "«PyroSafe System»", "«AeroClean Module»", "«TerraForm Suite»", "«HoloScan Platform»",
      "«VoltEdge Controller»", "«ClearWater Tech»", "«SonicPulse Array»", "«LaserCut Solutions»",
      "«MagLev Transport»", "«BioPrint System»", "«AgriSmart Platform»", "«MedTech Suite»",
      "«RoboAssist Framework»", "«DroneGuard System»", "«SmartBuild Module»", "«EnergyStore Hub»",
      "«CleanAir Network»", "«WasteZero Process»", "«FoodTech Solutions»", "«TextilePro System»",
      "«ChemPure Platform»", "«MetalForm Suite»"
    ]
  },
  "ai-models": {
    type: "Модель ИИ",
    names: [
      "«PredictNet Core»", "«VisionAI Pro»", "«NeuralPath Engine»", "«DeepAnalytics Suite»",
      "«CogniSense Model»", "«AutoML Framework»", "«PatternMind System»", "«DataSynth AI»",
      "«SmartPredict Hub»", "«IntelliProcess Core»", "«SemanticFlow Engine»", "«AdaptLearn Suite»",
      "«RiskAI Analyzer»", "«ForecastPro Model»", "«ClassifyNet System»", "«ClusterMind Hub»",
      "«NLP Processor Pro»", "«ImageSense Core»", "«VoiceAI Engine»", "«TextMiner Suite»",
      "«AnomalyDetect Model»", "«RecommendAI System»", "«OptimizeNet Hub»", "«SegmentPro Core»",
      "«TranslateAI Engine»", "«SentimentPro Suite»", "«ObjectTrack Model»", "«FaceMatch System»",
      "«SpeechSynth Hub»", "«DocuAI Analyzer»", "«ChartMind Core»", "«PricePredict Engine»",
      "«DemandForecast Suite»", "«QualityAI Model»", "«MaintenancePredict System»", "«RoutePlanner Hub»",
      "«InventoryAI Core»", "«CustomerInsight Engine»", "«FraudDetect Suite»", "«CreditScore Model»",
      "«ChurnPredict System»", "«LeadScore Hub»"
    ]
  },
  software: {
    type: "Программный продукт",
    names: [
      "«DocuFlow Manager»", "«TaskMaster Pro»", "«CloudSync Platform»", "«SecureVault System»",
      "«DataBridge Connector»", "«ReportGen Suite»", "«WorkFlow Engine»", "«TeamSpace Hub»",
      "«InventoryPro System»", "«FinanceCore Platform»", "«HRManager Suite»", "«CRMaster Engine»",
      "«ProjectTrack Hub»", "«SalesForce Pro»", "«SupportDesk System»", "«ContractMaster Platform»",
      "«BillingPro Suite»", "«AssetManager Engine»", "«LogiTrack Hub»", "«SupplyChain Pro»",
      "«QualityControl System»", "«ProductionPlan Platform»", "«MaintenanceLog Suite»", "«SafetyCheck Engine»",
      "«ComplianceHub Pro»", "«AuditTrail System»", "«BackupMaster Platform»", "«MonitorPro Suite»",
      "«AlertSystem Engine»", "«DashboardPro Hub»", "«AnalyticsMaster Pro»", "«IntegrationBridge System»",
      "«APIGateway Platform»", "«MessageQueue Suite»", "«CacheMaster Engine»", "«LoadBalancer Hub»",
      "«ContainerOrch Pro»", "«ServiceMesh System»", "«EventProcessor Platform»", "«StreamHandler Suite»",
      "«BatchRunner Engine»", "«SchedulerPro Hub»"
    ]
  },
  datasets: {
    type: "Датасет",
    names: [
      "«RetailInsight Dataset»", "«FinanceMetrics Collection»", "«HealthData Repository»", "«TransportFlow Archive»",
      "«ConsumerBehavior Set»", "«IndustrialSensors Data»", "«WeatherPatterns Collection»", "«SocialMedia Repository»",
      "«EcommerceTransactions Archive»", "«ManufacturingQuality Set»", "«EnergyConsumption Data»", "«RealEstate Collection»",
      "«JobMarket Repository»", "«EducationMetrics Archive»", "«TravelPatterns Set»", "«FoodService Data»",
      "«InsuranceClaims Collection»", "«TelecomUsage Repository»", "«MediaConsumption Archive»", "«SportStats Set»",
      "«AgricultureYield Data»", "«EnvironmentalMonitor Collection»", "«TrafficFlow Repository»", "«CrimeStats Archive»",
      "«DemographicTrends Set»", "«EconomicIndicators Data»", "«SupplyChain Collection»", "«CustomerFeedback Repository»",
      "«ProductReviews Archive»", "«PriceHistory Set»", "«InventoryLevels Data»", "«SalesPerformance Collection»",
      "«MarketingCampaigns Repository»", "«WebAnalytics Archive»", "«AppUsage Set»", "«DeviceMetrics Data»",
      "«NetworkTraffic Collection»", "«ServerLogs Repository»", "«SecurityEvents Archive»", "«UserBehavior Set»",
      "«ContentEngagement Data»", "«AdPerformance Collection»"
    ]
  },
  patents: {
    type: "Патент",
    names: [
      "«Метод адаптивной фильтрации»", "«Способ термической обработки»", "«Устройство контроля давления»",
      "«Система распределённого хранения»", "«Метод оптимизации маршрутов»", "«Способ очистки жидкостей»",
      "«Устройство измерения параметров»", "«Система автоматического управления»", "«Метод синтеза материалов»",
      "«Способ обработки сигналов»", "«Устройство генерации энергии»", "«Система мониторинга состояния»",
      "«Метод прогнозирования отказов»", "«Способ защиты данных»", "«Устройство беспроводной связи»",
      "«Система позиционирования объектов»", "«Метод компрессии информации»", "«Способ визуализации данных»",
      "«Устройство захвата изображений»", "«Система распознавания образов»", "«Метод машинного обучения»",
      "«Способ обработки запросов»", "«Устройство хранения информации»", "«Система балансировки нагрузки»",
      "«Метод шифрования данных»", "«Способ аутентификации пользователей»", "«Устройство биометрического контроля»",
      "«Система управления доступом»", "«Метод оптимизации запросов»", "«Способ кэширования данных»",
      "«Устройство мониторинга сети»", "«Система обнаружения аномалий»", "«Метод резервного копирования»",
      "«Способ восстановления данных»", "«Устройство синхронизации»", "«Система репликации»",
      "«Метод миграции данных»", "«Способ валидации транзакций»", "«Устройство обработки платежей»",
      "«Система верификации документов»", "«Метод цифровой подписи»", "«Способ блокчейн-хранения»"
    ]
  },
  databases: {
    type: "База данных",
    names: [
      "«Retail Insight Pro»", "«Finance Analytics Hub»", "«Medical Records System»", "«Logistics Tracker DB»",
      "«Customer360 Repository»", "«ProductCatalog Master»", "«SupplierNetwork Base»", "«EmployeeDirectory Hub»",
      "«ContractRegistry System»", "«AssetInventory DB»", "«OrderManagement Repository»", "«InvoiceArchive Master»",
      "«PaymentHistory Base»", "«ShipmentTracker Hub»", "«WarehouseStock System»", "«VendorRatings DB»",
      "«PriceComparison Repository»", "«MarketResearch Master»", "«CompetitorAnalysis Base»", "«TrendMonitor Hub»",
      "«FeedbackCollector System»", "«SurveyResults DB»", "«LeadDatabase Repository»", "«CampaignMetrics Master»",
      "«ContentLibrary Base»", "«MediaAssets Hub»", "«DocumentArchive System»", "«KnowledgeBase DB»",
      "«FAQRepository Master»", "«TicketHistory Base»", "«IncidentLog Hub»", "«ChangeManagement System»",
      "«ReleaseNotes DB»", "«FeatureRequests Repository»", "«BugTracker Master»", "«TestCases Base»",
      "«QAMetrics Hub»", "«DeploymentLog System»", "«ConfigurationDB Master»", "«EnvironmentRegistry Base»",
      "«ServiceCatalog Hub»", "«APIRegistry System»"
    ]
  },
  knowhow: {
    type: "Ноу-хау",
    names: [
      "«ThermoProcess Technique»", "«BioSynth Method»", "«NanoCoating Formula»", "«CryoPreserve Protocol»",
      "«HydroExtract Process»", "«SolarCapture Technique»", "«WindHarvest Method»", "«GeoThermal Formula»",
      "«PlasmaClean Protocol»", "«LaserWeld Process»", "«UltraSonic Technique»", "«MicroMill Method»",
      "«ElectroPolish Formula»", "«VacuumDeposit Protocol»", "«ChemEtch Process»", "«HeatTreat Technique»",
      "«ColdForm Method»", "«PrecisionCast Formula»", "«RapidPrototype Protocol»", "«AdditiveManufacture Process»",
      "«SurfaceFinish Technique»", "«QualityAssure Method»", "«LeakTest Formula»", "«StrengthTest Protocol»",
      "«Calibration Process»", "«Sterilization Technique»", "«Packaging Method»", "«StorageOptimize Formula»",
      "«LogisticsRoute Protocol»", "«InventoryBalance Process»", "«DemandForecast Technique»", "«PriceOptimize Method»",
      "«CustomerSegment Formula»", "«RetentionBoost Protocol»", "«ConversionOptimize Process»", "«ABTest Technique»",
      "«PersonalizationEngine Method»", "«RecommendationTune Formula»", "«SearchRank Protocol»", "«ContentOptimize Process»",
      "«EngagementBoost Technique»", "«ViralGrowth Method»"
    ]
  },
  specifications: {
    type: "Техспецификация",
    names: [
      "«Industrial Controller Spec»", "«Network Protocol Standard»", "«API Interface Definition»", "«DataFormat Schema»",
      "«SecurityPolicy Framework»", "«QualityMetrics Standard»", "«TestProcedure Protocol»", "«DeploymentGuide Spec»",
      "«IntegrationManual Definition»", "«UserInterface Schema»", "«DatabaseDesign Framework»", "«SystemArchitecture Standard»",
      "«PerformanceBenchmark Protocol»", "«ScalabilityRequirements Spec»", "«ReliabilityStandard Definition»",
      "«MaintenanceProcedure Schema»", "«DisasterRecovery Framework»", "«BackupPolicy Standard»", "«MonitoringSetup Protocol»",
      "«AlertConfiguration Spec»", "«LoggingStandard Definition»", "«AuditTrail Schema»", "«ComplianceCheck Framework»",
      "«SecurityAudit Standard»", "«PenetrationTest Protocol»", "«VulnerabilityAssessment Spec»", "«RiskAnalysis Definition»",
      "«IncidentResponse Schema»", "«ChangeManagement Framework»", "«ReleaseProcess Standard»", "«VersionControl Protocol»",
      "«CodeReview Spec»", "«TestAutomation Definition»", "«CICDPipeline Schema»", "«ContainerSpec Framework»",
      "«KubernetesConfig Standard»", "«ServiceMesh Protocol»", "«APIGateway Spec»", "«LoadBalancer Definition»",
      "«CacheStrategy Schema»", "«DatabaseTuning Framework»"
    ]
  },
  trademarks: {
    type: "Товарный знак",
    names: [
      "«AquaPure»", "«TechnoVision»", "«SmartLife»", "«EcoBalance»", "«NatureFirst»", "«UrbanStyle»", "«FreshChoice»",
      "«PowerMax»", "«SafeGuard»", "«CleanAir»", "«SunBright»", "«WaveRider»", "«StormProof»", "«IronStrength»",
      "«SilkTouch»", "«GoldenHarvest»", "«SilverStream»", "«CrystalClear»", "«VelvetComfort»", "«SteelCore»",
      "«DiamondEdge»", "«PlatinumPlus»", "«BronzeClassic»", "«CopperGlow»", "«MarbleFinish»", "«GraniteForce»",
      "«OakSolid»", "«PineNatural»", "«MapleSweet»", "«CedarFresh»", "«WillowGrace»", "«BirchPure»", "«ElmStrong»",
      "«BeechWarm»", "«AshLight»", "«WalnutRich»", "«CherryBloom»", "«PeachSoft»", "«AppleCrisp»", "«GrapeBold»",
      "«LemonZest»", "«OrangeVibe»"
    ]
  },
  copyrights: {
    type: "Авторское произведение",
    names: [
      "«Руководство по управлению проектами»", "«Курс финансовой грамотности»", "«Учебник по программированию»",
      "«Методика обучения языкам»", "«Сборник бизнес-кейсов»", "«Пособие по маркетингу»", "«Справочник по продажам»",
      "«Гид по переговорам»", "«Тренинг личной эффективности»", "«Программа развития лидерства»",
      "«Курс по тайм-менеджменту»", "«Методика командной работы»", "«Система мотивации персонала»",
      "«Руководство по HR-процессам»", "«Стандарты клиентского сервиса»", "«Скрипты продаж»",
      "«Шаблоны презентаций»", "«Библиотека инфографики»", "«Коллекция иконок»", "«Набор UI-компонентов»",
      "«Фирменный стиль бренда»", "«Гайдлайн визуальной идентичности»", "«Музыкальная библиотека»",
      "«Коллекция звуковых эффектов»", "«Видеокурс по дизайну»", "«Серия обучающих вебинаров»",
      "«Подкаст-серия по бизнесу»", "«Аудиокнига по саморазвитию»", "«Электронный журнал»",
      "«Серия статей по технологиям»", "«Белая книга по индустрии»", "«Аналитический отчёт»",
      "«Исследование рынка»", "«Маркетинговое исследование»", "«Опросник для исследований»",
      "«Методология оценки»", "«Фреймворк анализа»", "«Модель прогнозирования»", "«Калькулятор ROI»",
      "«Симулятор бизнес-процессов»", "«Игровой сценарий»", "«Интерактивный тренажёр»"
    ]
  },
  "digital-twins": {
    type: "Цифровой двойник",
    names: [
      "«Factory Floor Twin»", "«Production Line Model»", "«Warehouse Layout Twin»", "«Supply Chain Simulator»",
      "«Building Energy Model»", "«HVAC System Twin»", "«Power Grid Simulator»", "«Water Network Model»",
      "«Traffic Flow Twin»", "«Airport Operations Simulator»", "«Port Logistics Model»", "«Rail Network Twin»",
      "«Fleet Management Simulator»", "«Vehicle Performance Model»", "«Engine Dynamics Twin»",
      "«Turbine Operation Simulator»", "«Pump System Model»", "«Conveyor Belt Twin»", "«Robot Arm Simulator»",
      "«Assembly Cell Model»", "«Quality Control Twin»", "«Testing Rig Simulator»", "«Lab Equipment Model»",
      "«Clean Room Twin»", "«Data Center Simulator»", "«Server Rack Model»", "«Network Topology Twin»",
      "«Cloud Infrastructure Simulator»", "«Storage Array Model»", "«Cooling System Twin»",
      "«Security System Simulator»", "«Access Control Model»", "«Surveillance Network Twin»",
      "«Fire Safety Simulator»", "«Emergency Response Model»", "«Evacuation Route Twin»",
      "«Crowd Flow Simulator»", "«Event Venue Model»", "«Stadium Operations Twin»",
      "«Retail Store Simulator»", "«Shelf Layout Model»", "«Customer Flow Twin»"
    ]
  },
  prototypes: {
    type: "Прототип R&D",
    names: [
      "«BioSensor Alpha»", "«NanoMaterial Beta»", "«QuantumChip Gamma»", "«FusionReactor Delta»",
      "«HoloDisplay Epsilon»", "«NeuralInterface Zeta»", "«ExoSkeleton Eta»", "«DroneSwarm Theta»",
      "«AutonomousVehicle Iota»", "«SmartFabric Kappa»", "«FlexibleBattery Lambda»", "«WirelessCharger Mu»",
      "«SolarCell Nu»", "«WindTurbine Xi»", "«WaveGenerator Omicron»", "«GeoThermalTap Pi»",
      "«HydrogenCell Rho»", "«CarbonCapture Sigma»", "«WaterPurifier Tau»", "«AirFilter Upsilon»",
      "«FoodPrinter Phi»", "«MedicalImplant Chi»", "«ProstheticLimb Psi»", "«HearingAid Omega»",
      "«SmartGlasses Alpha2»", "«ARHeadset Beta2»", "«VRController Gamma2»", "«HapticGlove Delta2»",
      "«MotionCapture Epsilon2»", "«FacialTracker Zeta2»", "«EyeTracker Eta2»", "«BrainInterface Theta2»",
      "«MuscleStimulator Iota2»", "«SleepMonitor Kappa2»", "«StressDetector Lambda2»", "«MoodTracker Mu2»",
      "«HealthBand Nu2»", "«SmartPill Xi2»", "«MicroRobot Omicron2»", "«NanoBot Pi2»",
      "«CellRepair Rho2»", "«GeneEditor Sigma2»"
    ]
  }
};

const padNumber = (num: number): string => {
  return num.toString().padStart(3, "0");
};

// Price ranges per category (min, max) in RUB
const categoryPriceRanges: Record<string, [number, number]> = {
  techpacks: [500000, 5000000],
  "ai-models": [300000, 3000000],
  software: [200000, 2500000],
  datasets: [100000, 1500000],
  patents: [800000, 8000000],
  databases: [150000, 2000000],
  knowhow: [250000, 3500000],
  specifications: [50000, 500000],
  trademarks: [100000, 1500000],
  copyrights: [50000, 800000],
  "digital-twins": [400000, 4000000],
  prototypes: [600000, 6000000],
};

const generateRandomPrice = (min: number, max: number): number => {
  const price = Math.floor(Math.random() * (max - min) + min);
  return Math.round(price / 10000) * 10000;
};

const generateDemoListings = (): DemoListing[] => {
  const listings: DemoListing[] = [];
  const categorySlugs = Object.keys(categoryNames);
  const itemsPerCategory = Math.floor(500 / 12);
  const remainder = 500 % 12;
  
  let globalId = 1;
  
  categorySlugs.forEach((categorySlug, categoryIndex) => {
    const category = categoryNames[categorySlug];
    const descriptionGenerator = categoryDescriptions[categorySlug];
    const itemCount = itemsPerCategory + (categoryIndex < remainder ? 1 : 0);
    
    for (let i = 0; i < itemCount; i++) {
      const nameIndex = i % category.names.length;
      const name = category.names[nameIndex];
      const fullName = `${category.type} ${name}`;
      const description = descriptionGenerator(name);
      const priceRange = categoryPriceRanges[categorySlug] || [100000, 1000000];
      const price = generateRandomPrice(priceRange[0], priceRange[1]);
      
      listings.push({
        id: `demo-${globalId}`,
        category: categorySlug,
        name: fullName,
        description: description,
        registration_number: `DEMO-${padNumber(globalId)}`,
        price: price,
        price_negotiable: true,
        status: "demo",
        views_count: Math.floor(Math.random() * 200) + 50,
        favorites_count: 0,
        cart_count: 0,
        is_demo: true,
        demo_label: "Ознакомительный · недоступна для сделки",
        legal_status: "Демо-карточка: сделки по объекту не совершаются",
        can_buy: false,
        created_at: new Date(Date.now() - globalId * 60000).toISOString(),
        user_id: "demo-user",
      });
      
      globalId++;
    }
  });
  
  return listings;
};

export const demoListings = generateDemoListings();

export const getDemoListingsByCategory = (categorySlug: string): DemoListing[] => {
  if (categorySlug === "all") return demoListings;
  return demoListings.filter(item => item.category === categorySlug);
};

export const getDemoListingById = (id: string): DemoListing | undefined => {
  return demoListings.find(item => item.id === id);
};

export const getDemoCategoryCount = (categorySlug: string): number => {
  return demoListings.filter(item => item.category === categorySlug).length;
};
