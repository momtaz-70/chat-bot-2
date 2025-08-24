/**
 * Legal Assistant Module for Iranian Lawyers
 * Provides specialized functionality for Iranian legal practice
 */
class LegalAssistant {
    constructor() {
        this.legalCodes = this.initializeLegalCodes();
        this.documentTemplates = this.initializeDocumentTemplates();
        this.legalPrompts = this.initializeLegalPrompts();
        this.iranianLaws = this.initializeIranianLaws();
        this.courtInfo = this.initializeCourtInfo();
        this.caseLawDatabase = this.initializeCaseLawDatabase();
        this.legalHolidays = this.initializeLegalHolidays();
        this.contractAnalysis = this.initializeContractAnalysis();
    }

    /**
     * Initialize Iranian Legal Codes references
     */
    initializeLegalCodes() {
        return {
            civil: {
                name: 'قانون مدنی - Civil Code',
                description: 'Iranian Civil Code',
                articles: 1223,
                url: 'http://rc.majlis.ir/fa/law/show/90130'
            },
            criminal: {
                name: 'قانون مجازات اسلامی - Criminal Code',
                description: 'Islamic Criminal Code of Iran',
                articles: 738,
                url: 'http://rc.majlis.ir/fa/law/show/845048'
            },
            commercial: {
                name: 'قانون تجارت - Commercial Code',
                description: 'Iranian Commercial Code',
                articles: 333,
                url: 'http://rc.majlis.ir/fa/law/show/90133'
            },
            procedure: {
                name: 'آیین دادرسی مدنی - Civil Procedure Code',
                description: 'Iranian Civil Procedure Code',
                articles: 518,
                url: 'http://rc.majlis.ir/fa/law/show/132608'
            },
            criminal_procedure: {
                name: 'آیین دادرسی کیفری - Criminal Procedure Code',
                description: 'Iranian Criminal Procedure Code',
                articles: 588,
                url: 'http://rc.majlis.ir/fa/law/show/845063'
            },
            family: {
                name: 'قانون حمایت خانواده - Family Protection Law',
                description: 'Iranian Family Protection Law',
                articles: 41,
                url: 'http://rc.majlis.ir/fa/law/show/1020475'
            },
            labor: {
                name: 'قانون کار - Labor Law',
                description: 'Iranian Labor Law',
                articles: 190,
                url: 'http://rc.majlis.ir/fa/law/show/90147'
            }
        };
    }

    /**
     * Initialize Document Templates
     */
    initializeDocumentTemplates() {
        return {
            contract: {
                name: 'قرارداد - Contract',
                template: `قرارداد [نوع قرارداد]

طرفین قرارداد:
الف) [نام و مشخصات طرف اول]
ب) [نام و مشخصات طرف دوم]

ماده 1 - موضوع قرارداد:
[شرح موضوع قرارداد]

ماده 2 - تعهدات طرفین:
[شرح تعهدات]

ماده 3 - مدت قرارداد:
[مدت اجرا]

ماده 4 - حق الزحمه و نحوه پرداخت:
[مبلغ و نحوه پرداخت]

ماده 5 - شرایط فسخ:
[شرایط فسخ قرارداد]

تاریخ: [تاریخ]
امضای طرفین`
            },
            power_of_attorney: {
                name: 'وکالت‌نامه - Power of Attorney',
                template: `وکالت‌نامه

من [نام و مشخصات موکل] ساکن [آدرس] به موجب این وکالت‌نامه آقای/خانم [نام و مشخصات وکیل] ساکن [آدرس] را برای انجام امور ذیل وکیل می‌نمایم:

1- [شرح اختیارات وکیل]
2- [...]

این وکالت‌نامه از تاریخ [تاریخ] تا [تاریخ پایان] معتبر است.

تاریخ: [تاریخ]
امضای موکل: [امضا]
امضای وکیل: [امضا]`
            },
            complaint: {
                name: 'دادخواست - Legal Complaint',
                template: `دادخواست

به دادگاه محترم [نوع دادگاه] [شهر]

خواهان: [نام و مشخصات]
خوانده: [نام و مشخصات]

موضوع: [موضوع دعوا]

شرح دعوا:
[شرح تفصیلی ماجرا]

دلایل و مستندات:
[ذکر دلایل و مستندات]

درخواست:
[درخواست از دادگاه]

تاریخ: [تاریخ]
امضای خواهان یا وکیل`
            },
            appeal: {
                name: 'اعتراض - Appeal',
                template: `اعتراض به رای صادره

به دادگاه محترم [دادگاه تجدیدنظر]

معترض: [نام و مشخصات]
مورد اعتراض: رای شماره [شماره رای] مورخ [تاریخ] دادگاه [نام دادگاه]

علل اعتراض:
1- [علت اول]
2- [علت دوم]

درخواست:
نقض رای مذکور و اعاده پرونده یا صدور رای عادلانه

تاریخ: [تاریخ]
امضای معترض یا وکیل`
            }
        };
    }

    /**
     * Initialize Legal Prompt Templates
     */
    initializeLegalPrompts() {
        return {
            'contract-review': {
                title: 'بررسی قرارداد - Contract Review',
                prompt: `من یک وکیل حقوق تجارت هستم و نیاز به بررسی قرارداد دارم. لطفاً قرارداد زیر را از نظر حقوقی بررسی کنید و نکات مهم، خلاءهای قانونی، و پیشنهادات اصلاحی را ارائه دهید:

[متن قرارداد]

لطفاً موارد زیر را بررسی کنید:
1. صحت شکلی قرارداد طبق قوانین ایران
2. وضوح شرایط و تعهدات
3. خلاءهای قانونی احتمالی
4. ریسک‌های حقوقی
5. پیشنهادات اصلاحی`
            },
            'legal-research': {
                title: 'تحقیق حقوقی - Legal Research',
                prompt: `من یک وکیل دادگستری هستم و نیاز به تحقیق در موضوع حقوقی زیر دارم:

موضوع: [موضوع تحقیق]

لطفاً اطلاعات زیر را ارائه دهید:
1. مواد قانونی مرتبط از قوانین ایران
2. رویه قضایی و سوابق مشابه
3. نظرات حقوقدانان معتبر
4. تفسیر و راهکارهای عملی
5. استراتژی حقوقی پیشنهادی`
            },
            'case-analysis': {
                title: 'تحلیل پرونده - Case Analysis',
                prompt: `من یک وکیل هستم و نیاز به تحلیل پرونده زیر دارم:

خلاصه پرونده: [خلاصه موضوع]

لطفاً تحلیل جامعی از موارد زیر ارائه دهید:
1. تحلیل حقوقی موضوع
2. قوت و ضعف پرونده
3. استراتژی دفاعی/تهاجمی
4. پیش‌بینی نتیجه دادرسی
5. توصیه‌های عملی برای پیگیری`
            },
            'document-draft': {
                title: 'تنظیم سند - Document Drafting',
                prompt: `من نیاز به تنظیم سند حقوقی زیر دارم:

نوع سند: [نوع سند]
مشخصات: [جزئیات مورد نیاز]

لطفاً پیش‌نویس سندی مطابق با قوانین ایران تهیه کنید که شامل:
1. ساختار صحیح قانونی
2. شرایط و بندهای ضروری
3. زبان حقوقی مناسب
4. ضمانت اجراهای لازم
5. راهکارهای حل اختلاف`
            }
        };
    }

    /**
     * Initialize Iranian Laws Quick Reference
     */
    initializeIranianLaws() {
        return {
            'inheritance': {
                title: 'قوانین ارث - Inheritance Laws',
                summary: 'قوانین مربوط به ارث در حقوق ایران بر اساس احکام اسلامی تنظیم شده است.',
                key_articles: ['869 تا 948 قانون مدنی'],
                important_notes: [
                    'تعیین وراث بر اساس احکام اسلامی',
                    'سهم الارث زن نصف مرد در همان درجه',
                    'امکان وصیت به یک‌سوم اموال'
                ]
            },
            'property': {
                title: 'حق مالکیت - Property Rights',
                summary: 'قوانین مالکیت در ایران شامل انواع مختلف مالکیت و روش‌های انتقال',
                key_articles: ['30 تا 139 قانون مدنی'],
                important_notes: [
                    'مالکیت مطلق و مقید',
                    'ثبت اسناد و سند مالکیت',
                    'شفعه و حق تقدم'
                ]
            },
            'contracts': {
                title: 'عقود و قراردادها - Contracts',
                summary: 'قوانین عقود در حقوق ایران بر اساس اصول اسلامی و عرف',
                key_articles: ['183 تا 308 قانون مدنی'],
                important_notes: [
                    'اصل آزادی اراده',
                    'لزوم و عدم لزوم عقود',
                    'شرایط صحت عقد'
                ]
            }
        };
    }

    /**
     * Initialize Court Information
     */
    initializeCourtInfo() {
        return {
            'civil_courts': {
                name: 'دادگاه‌های مدنی',
                jurisdiction: 'رسیدگی به دعاوی مدنی و تجاری',
                levels: ['دادگاه صلح', 'دادگاه عمومی', 'دادگاه تجدیدنظر', 'دیوان عالی کشور'],
                filing_fees: 'بر اساس جدول هزینه دادرسی'
            },
            'criminal_courts': {
                name: 'دادگاه‌های کیفری',
                jurisdiction: 'رسیدگی به جرائم',
                levels: ['دادیار', 'دادگاه کیفری', 'دادگاه تجدیدنظر', 'دیوان عالی کشور'],
                filing_fees: 'بر اساس نوع جرم'
            },
            'administrative_courts': {
                name: 'دیوان عدالت اداری',
                jurisdiction: 'رسیدگی به تخلفات اداری',
                levels: ['هیأت بدوی', 'هیأت عمومی'],
                filing_fees: 'طبق تعرفه مصوب'
            }
        };
    }

    /**
     * Get specialized legal prompt based on template
     */
    getLegalPrompt(templateId, customData = {}) {
        const template = this.legalPrompts[templateId];
        if (!template) {
            return null;
        }

        let prompt = template.prompt;
        
        // Replace placeholders with custom data
        Object.keys(customData).forEach(key => {
            prompt = prompt.replace(`[${key}]`, customData[key]);
        });

        return {
            title: template.title,
            prompt: prompt
        };
    }

    /**
     * Get legal code information
     */
    getLegalCodeInfo(codeId) {
        return this.legalCodes[codeId] || null;
    }

    /**
     * Get document template
     */
    getDocumentTemplate(templateId) {
        return this.documentTemplates[templateId] || null;
    }

    /**
     * Get Iranian law quick reference
     */
    getLawReference(lawId) {
        return this.iranianLaws[lawId] || null;
    }

    /**
     * Calculate court fees (simplified)
     */
    calculateCourtFees(claimAmount, courtType = 'civil') {
        const fees = {
            civil: {
                base: 10000,
                percentage: 0.005,
                max: 5000000
            },
            criminal: {
                base: 5000,
                percentage: 0,
                max: 50000
            },
            administrative: {
                base: 8000,
                percentage: 0.003,
                max: 2000000
            }
        };

        const feeStructure = fees[courtType] || fees.civil;
        const calculatedFee = feeStructure.base + (claimAmount * feeStructure.percentage);
        
        return {
            fee: Math.min(calculatedFee, feeStructure.max),
            currency: 'تومان',
            breakdown: {
                base: feeStructure.base,
                percentage: (claimAmount * feeStructure.percentage),
                total: Math.min(calculatedFee, feeStructure.max)
            }
        };
    }

    /**
     * Calculate legal deadlines based on procedure type
     */
    calculateDeadlines(procedureType, startDate = new Date()) {
        const deadlines = {
            'appeal': { days: 20, description: 'مهلت تجدیدنظرخواهی' },
            'cassation': { days: 20, description: 'مهلت فراجام‌خواهی' },
            'objection': { days: 10, description: 'مهلت اعتراض' },
            'response': { days: 30, description: 'مهلت پاسخ دادخواست' },
            'evidence': { days: 15, description: 'مهلت ارائه مدارک' },
            'execution': { days: 30, description: 'مهلت اجرای حکم' }
        };

        const deadline = deadlines[procedureType];
        if (!deadline) {
            return null;
        }

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + deadline.days);

        return {
            type: procedureType,
            days: deadline.days,
            description: deadline.description,
            startDate: startDate.toLocaleDateString('fa-IR'),
            endDate: endDate.toLocaleDateString('fa-IR'),
            remainingDays: Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24))
        };
    }

    /**
     * Search legal precedents (mock data for demonstration)
     */
    searchPrecedents(query, category = 'all') {
        // This would typically connect to a legal database
        const mockPrecedents = [
            {
                id: 1,
                title: 'رای وحدت رویه شماره 736',
                court: 'دیوان عالی کشور',
                date: '1400/05/15',
                category: 'civil',
                summary: 'در خصوص تفسیر ماده 220 قانون مدنی...',
                relevance: 85
            },
            {
                id: 2,
                title: 'رای شماره 123 هیأت عمومی',
                court: 'دیوان عالی کشور',
                date: '1399/12/08',
                category: 'commercial',
                summary: 'راجع به اعتبار امضای الکترونیکی...',
                relevance: 78
            }
        ];

        return mockPrecedents.filter(precedent => 
            category === 'all' || precedent.category === category
        );
    }

    /**
     * Validate legal document structure
     */
    validateDocument(documentText, documentType) {
        const validationRules = {
            contract: [
                'وجود مشخصات طرفین',
                'تعیین موضوع قرارداد',
                'شرایط و تعهدات',
                'امضای طرفین'
            ],
            complaint: [
                'مشخصات خواهان و خوانده',
                'شرح دعوا',
                'دلایل و مستندات',
                'درخواست از دادگاه'
            ],
            power_of_attorney: [
                'مشخصات موکل و وکیل',
                'شرح اختیارات',
                'مدت اعتبار',
                'امضای طرفین'
            ]
        };

        const rules = validationRules[documentType] || [];
        const issues = [];
        
        rules.forEach(rule => {
            // Simple validation logic (would be more sophisticated in practice)
            if (!this.checkDocumentElement(documentText, rule)) {
                issues.push(`نقص در: ${rule}`);
            }
        });

        return {
            isValid: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 20))
        };
    }

    /**
     * Helper method to check document elements
     */
    checkDocumentElement(text, element) {
        // Simplified check - in practice would use more sophisticated parsing
        const keywords = {
            'وجود مشخصات طرفین': ['نام', 'آدرس', 'کد ملی'],
            'تعیین موضوع قرارداد': ['موضوع', 'ماده'],
            'شرایط و تعهدات': ['تعهد', 'شرط'],
            'امضای طرفین': ['امضا'],
            'شرح دعوا': ['شرح', 'دعوا'],
            'دلایل و مستندات': ['دلیل', 'مستند'],
            'درخواست از دادگاه': ['درخواست'],
            'شرح اختیارات': ['اختیار', 'وکالت'],
            'مدت اعتبار': ['مدت', 'تاریخ']
        };

        const elementKeywords = keywords[element] || [];
        return elementKeywords.some(keyword => text.includes(keyword));
    }

    /**
     * Generate legal research suggestions
     */
    generateResearchSuggestions(topic, specialty = 'general') {
        const suggestions = {
            general: [
                'بررسی قوانین مرتبط',
                'جستجوی سوابق قضایی',
                'مطالعه نظریات حقوقدانان',
                'بررسی آیین‌نامه‌های اجرایی'
            ],
            civil: [
                'مراجعه به قانون مدنی',
                'بررسی آیین دادرسی مدنی',
                'مطالعه رویه قضایی',
                'جستجوی آرای وحدت رویه'
            ],
            criminal: [
                'مراجعه به قانون مجازات اسلامی',
                'بررسی آیین دادرسی کیفری',
                'مطالعه نظریات فقهی',
                'جستجوی سوابق قضایی مشابه'
            ],
            commercial: [
                'بررسی قانون تجارت',
                'مطالعه مقررات بورس',
                'جستجوی آرای اقتصادی',
                'بررسی قوانین مالیاتی'
            ]
        };

        return suggestions[specialty] || suggestions.general;
    }
    
    /**
     * Initialize Case Law Database (mock data)
     */
    initializeCaseLawDatabase() {
        return [
            {
                id: 1,
                title: 'رای وحدت رویه شماره 736 در خصوص تفسیر ماده 220 قانون مدنی',
                court: 'دیوان عالی کشور',
                date: '1400/05/15',
                year: '1400',
                category: 'civil',
                summary: 'در خصوص تفسیر ماده 220 قانون مدنی راجع به شرایط صحت بیع و نقش اراده در عقود...',
                fullText: 'متن کامل رای...',
                keywords: ['بیع', 'اراده', 'عقد', 'قانون مدنی'],
                relevance: 95
            },
            {
                id: 2,
                title: 'رای شماره 123 هیأت عمومی دیوان عالی - اعتبار امضای الکترونیکی',
                court: 'دیوان عالی کشور',
                date: '1399/12/08',
                year: '1399',
                category: 'commercial',
                summary: 'راجع به اعتبار امضای الکترونیکی در معاملات تجاری و شرایط قانونی آن...',
                fullText: 'متن کامل رای...',
                keywords: ['امضای الکترونیکی', 'تجارت', 'معاملات'],
                relevance: 88
            },
            {
                id: 3,
                title: 'رای کیفری شماره 456 - تعیین مجازات جرائم سایبری',
                court: 'دادگاه کیفری تهران',
                date: '1401/03/20',
                year: '1401',
                category: 'criminal',
                summary: 'در خصوص تعیین مجازات جرائم سایبری و کلاهبرداری اینترنتی...',
                fullText: 'متن کامل رای...',
                keywords: ['جرائم سایبری', 'کلاهبرداری', 'اینترنت'],
                relevance: 92
            },
            {
                id: 4,
                title: 'رای اداری شماره 789 - صلاحیت مراجع اداری',
                court: 'دیوان عدالت اداری',
                date: '1402/01/10',
                year: '1402',
                category: 'administrative',
                summary: 'راجع به تعیین صلاحیت مراجع اداری در رسیدگی به شکایات مردمی...',
                fullText: 'متن کامل رای...',
                keywords: ['اداری', 'صلاحیت', 'شکایت'],
                relevance: 85
            },
            {
                id: 5,
                title: 'رای خانواده شماره 321 - حضانت فرزندان',
                court: 'دادگاه خانواده تهران',
                date: '1403/02/15',
                year: '1403',
                category: 'family',
                summary: 'در خصوص تعیین حضانت فرزندان پس از طلاق و معیارهای قانونی...',
                fullText: 'متن کامل رای...',
                keywords: ['حضانت', 'طلاق', 'فرزندان', 'خانواده'],
                relevance: 90
            }
        ];
    }
    
    /**
     * Initialize Legal Holidays
     */
    initializeLegalHolidays() {
        return [
            {
                name: 'نوروز',
                date: '1403/01/01',
                description: 'تعطیلات نوروز',
                duration: 13,
                type: 'national'
            },
            {
                name: 'روز جمهوری اسلامی',
                date: '1403/01/12',
                description: 'روز جمهوری اسلامی ایران',
                duration: 1,
                type: 'national'
            },
            {
                name: 'شهادت امام علی (ع)',
                date: '1403/02/11',
                description: 'شهادت حضرت علی (ع)',
                duration: 1,
                type: 'religious'
            },
            {
                name: 'عید فطر',
                date: '1403/03/20',
                description: 'عید سعید فطر',
                duration: 2,
                type: 'religious'
            },
            {
                name: 'شهادت امام صادق (ع)',
                date: '1403/05/04',
                description: 'شهادت امام جعفر صادق (ع)',
                duration: 1,
                type: 'religious'
            },
            {
                name: 'عید قربان',
                date: '1403/06/10',
                description: 'عید سعید قربان',
                duration: 1,
                type: 'religious'
            },
            {
                name: 'عید غدیر خم',
                date: '1403/06/18',
                description: 'عید غدیر خم',
                duration: 1,
                type: 'religious'
            },
            {
                name: 'شهادت امام رضا (ع)',
                date: '1403/11/23',
                description: 'شهادت امام رضا (ع)',
                duration: 1,
                type: 'religious'
            },
            {
                name: 'شب یلدا',
                date: '1403/09/30',
                description: 'شب چله - یلدا',
                duration: 0,
                type: 'cultural'
            }
        ];
    }
    
    /**
     * Initialize Contract Analysis functionality
     */
    initializeContractAnalysis() {
        return {
            riskFactors: [
                'عدم تعیین دقیق موضوع قرارداد',
                'فقدان شرایط فسخ',
                'عدم تعیین مسئولیت‌های طرفین',
                'فقدان ضمانت اجرا',
                'عدم تعیین مرجع حل اختلاف',
                'فقدان تعیین قانون حاکم',
                'عدم تعیین مدت قرارداد',
                'فقدان شرایط تجدید یا تمدید'
            ],
            legalRequirements: [
                'وجود اراده صحیح طرفین',
                'تعیین موضوع مشخص و قابل اجرا',
                'وجود سبب مشروع',
                'رعایت شکلیات قانونی',
                'عدم مغایرت با نظم عمومی',
                'رعایت مقررات حمایت از مصرف‌کننده'
            ],
            improvementSuggestions: [
                'افزودن بندهای حل اختلاف',
                'تعیین دقیق‌تر تعهدات',
                'اضافه کردن شرایط فسخ',
                'تعیین ضمانت اجرای مناسب',
                'اصلاح زبان حقوقی'
            ]
        };
    }
    
    /**
     * Search case law database
     */
    searchCaseLaw(query, filters = {}) {
        let results = [...this.caseLawDatabase];
        
        // Apply text search
        if (query && query.trim()) {
            const searchTerms = query.toLowerCase().split(' ');
            results = results.filter(caseItem => {
                const searchText = (
                    caseItem.title + ' ' + 
                    caseItem.summary + ' ' + 
                    caseItem.keywords.join(' ')
                ).toLowerCase();
                
                return searchTerms.some(term => searchText.includes(term));
            });
        }
        
        // Apply filters
        if (filters.court && filters.court !== 'all') {
            results = results.filter(caseItem => {
                switch (filters.court) {
                    case 'supreme':
                        return caseItem.court.includes('دیوان عالی');
                    case 'appeal':
                        return caseItem.court.includes('تجدیدنظر');
                    case 'civil':
                        return caseItem.category === 'civil';
                    case 'criminal':
                        return caseItem.category === 'criminal';
                    case 'administrative':
                        return caseItem.court.includes('عدالت اداری');
                    default:
                        return true;
                }
            });
        }
        
        if (filters.year && filters.year !== 'all') {
            results = results.filter(caseItem => caseItem.year === filters.year);
        }
        
        if (filters.category && filters.category !== 'all') {
            results = results.filter(caseItem => caseItem.category === filters.category);
        }
        
        // Sort by relevance
        results.sort((a, b) => b.relevance - a.relevance);
        
        return results;
    }
    
    /**
     * Analyze contract text
     */
    analyzeContract(contractText, options = {}) {
        const analysis = {
            score: 0,
            risks: [],
            missing: [],
            suggestions: [],
            compliance: {
                formal: false,
                legal: false,
                enforceable: false
            }
        };
        
        // Basic analysis (in real implementation, would use NLP)
        const text = contractText.toLowerCase();
        
        // Check for basic contract elements
        const hasParties = text.includes('طرف') || text.includes('نام');
        const hasSubject = text.includes('موضوع') || text.includes('ماده');
        const hasPrice = text.includes('مبلغ') || text.includes('قیمت') || text.includes('هزینه');
        const hasSignature = text.includes('امضا') || text.includes('تاریخ');
        const hasTermination = text.includes('فسخ') || text.includes('لغو');
        
        let score = 0;
        
        if (hasParties) score += 20;
        else analysis.missing.push('تعیین مشخصات دقیق طرفین');
        
        if (hasSubject) score += 25;
        else analysis.missing.push('تعریف دقیق موضوع قرارداد');
        
        if (hasPrice) score += 20;
        else analysis.missing.push('تعیین مبلغ و نحوه پرداخت');
        
        if (hasSignature) score += 15;
        else analysis.missing.push('امضا و تاریخ');
        
        if (hasTermination) score += 10;
        else analysis.missing.push('شرایط فسخ قرارداد');
        
        // Check for potential risks
        if (!text.includes('ضمانت')) {
            analysis.risks.push('فقدان ضمانت اجرا');
        }
        
        if (!text.includes('حل اختلاف') && !text.includes('داوری')) {
            analysis.risks.push('عدم تعیین مرجع حل اختلاف');
        }
        
        if (!text.includes('مدت') && !text.includes('زمان')) {
            analysis.risks.push('عدم تعیین مدت قرارداد');
        }
        
        // Compliance checks
        analysis.compliance.formal = score >= 60;
        analysis.compliance.legal = hasParties && hasSubject;
        analysis.compliance.enforceable = analysis.compliance.formal && analysis.risks.length < 3;
        
        // Generate suggestions
        if (options.includeImprovements) {
            analysis.suggestions = this.contractAnalysis.improvementSuggestions.slice(0, 3);
        }
        
        analysis.score = Math.min(score + 10, 100); // Bonus points for having text
        
        return analysis;
    }
    
    /**
     * Get legal holidays for a specific year
     */
    getLegalHolidays(year = 1403) {
        return this.legalHolidays.filter(holiday => holiday.date.startsWith(year.toString()));
    }
    
    /**
     * Check if a date is a legal holiday
     */
    isLegalHoliday(date) {
        const dateStr = this.formatDateToPersian(date);
        return this.legalHolidays.some(holiday => {
            const holidayDate = holiday.date;
            if (holiday.duration > 1) {
                // Handle multi-day holidays
                const startDate = new Date(this.parseIranianDate(holidayDate));
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + holiday.duration - 1);
                const checkDate = new Date(date);
                return checkDate >= startDate && checkDate <= endDate;
            } else {
                return holidayDate === dateStr;
            }
        });
    }
    
    /**
     * Calculate working days excluding holidays
     */
    calculateWorkingDays(startDate, days) {
        let currentDate = new Date(startDate);
        let workingDays = 0;
        let totalDays = 0;
        
        while (workingDays < days) {
            // Skip Fridays and holidays
            if (currentDate.getDay() !== 5 && !this.isLegalHoliday(currentDate)) {
                workingDays++;
            }
            if (workingDays < days) {
                currentDate.setDate(currentDate.getDate() + 1);
                totalDays++;
            }
        }
        
        return {
            endDate: currentDate,
            totalDays: totalDays,
            workingDays: days,
            excludedDays: totalDays - days
        };
    }
    
    /**
     * Helper function to format date to Persian calendar
     */
    formatDateToPersian(date) {
        // Simplified Persian date conversion (in real app, use proper library)
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const persianYear = year - 621; // Approximate conversion
        return `${persianYear}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    }
    
    /**
     * Helper function to parse Iranian date
     */
    parseIranianDate(iranianDate) {
        const [year, month, day] = iranianDate.split('/').map(Number);
        const gregorianYear = year + 621; // Approximate conversion
        return new Date(gregorianYear, month - 1, day);
    }
}

// Create and export singleton instance
const legalAssistant = new LegalAssistant();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LegalAssistant, legalAssistant };
}

// Expose globally for browser usage
if (typeof window !== 'undefined') {
    window.legalAssistant = legalAssistant;
}