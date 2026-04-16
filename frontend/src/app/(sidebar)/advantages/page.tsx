import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Users,
  Truck,
  MapPin,
  ShieldCheck,
  Clock,
  DollarSign,
  Package,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import contacts from "@/contacts.json";

export default function AdvantagesPage() {
  return (
    <div className="flex-1">
      <h1 className="text-2xl font-bold mb-6">Наши преимущества</h1>

      {/* Main advantages grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2 flex items-center">
              <Building className="h-4 w-4 mr-2 text-blue-600" />
              Обширный ассортимент
            </h3>
            <p className="text-sm text-gray-600">
              Более 5000 наименований металлопроката различных марок и размеров всегда в наличии на наших складах.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2 flex items-center">
              <Truck className="h-4 w-4 mr-2 text-blue-600" />
              Оперативная доставка
            </h3>
            <p className="text-sm text-gray-600">
              Доставка по всему Казахстану в кратчайшие сроки благодаря собственному автопарку и налаженной логистике.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2 flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-600" />
              Профессиональная команда
            </h3>
            <p className="text-sm text-gray-600">
              Наши специалисты помогут подобрать оптимальный вариант металлопроката под ваши задачи и бюджет.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
              Удобное расположение
            </h3>
            <p className="text-sm text-gray-600">
              Склады и офисы компании расположены в ключевых городах Казахстана для вашего удобства.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed advantages tabs */}
      <Tabs defaultValue="quality" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quality">Качество продукции</TabsTrigger>
          <TabsTrigger value="service">Уровень обслуживания</TabsTrigger>
          <TabsTrigger value="pricing">Ценовая политика</TabsTrigger>
        </TabsList>

        <TabsContent value="quality" className="p-4 border rounded-md mt-2">
          <h3 className="font-medium mb-3 flex items-center">
            <ShieldCheck className="h-4 w-4 mr-2 text-blue-600" />
            Гарантия качества
          </h3>
          <p className="mb-4">
            Мы предлагаем только сертифицированную продукцию от ведущих производителей металлопроката. Каждая партия товара проходит строгий контроль качества:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>Сертификаты качества на всю продукцию</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>Регулярные проверки качества на складе</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>Гарантия на все виды металлопроката</span>
            </li>
          </ul>
        </TabsContent>

        <TabsContent value="service" className="p-4 border rounded-md mt-2">
          <h3 className="font-medium mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2 text-blue-600" />
            Профессиональный сервис
          </h3>
          <p className="mb-4">
            Наша команда специалистов обеспечивает высокий уровень обслуживания клиентов:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>Индивидуальный подход к каждому клиенту</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>Консультации по выбору продукции</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>Оперативное решение вопросов</span>
            </li>
          </ul>
        </TabsContent>

        <TabsContent value="pricing" className="p-4 border rounded-md mt-2">
          <h3 className="font-medium mb-3 flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
            Конкурентные цены
          </h3>
          <p className="mb-4">
            Мы предлагаем выгодные условия сотрудничества:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>Гибкая система скидок</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>Специальные предложения для постоянных клиентов</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>Бесплатная доставка при заказе от 1 000 000 тенге</span>
            </li>
          </ul>
        </TabsContent>
      </Tabs>

      {/* Additional benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2 flex items-center">
              <Package className="h-4 w-4 mr-2 text-blue-600" />
              Удобство работы
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>Онлайн-каталог продукции</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>Быстрое оформление заказа</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>Отслеживание статуса заказа</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-600" />
              Оперативность
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>Быстрая обработка заказов</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>Срочная доставка при необходимости</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>Круглосуточная поддержка</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Contact information */}
      <Alert className="bg-blue-50 border-blue-200">
        <Phone className="h-5 w-5 text-blue-600"/>
        <AlertTitle className="text-blue-800">Хотите узнать больше?</AlertTitle>
        <AlertDescription className="text-blue-600">
          Свяжитесь с нашими специалистами по телефону {contacts.phone.text} или напишите на email {contacts.email.info}
        </AlertDescription>
      </Alert>
    </div>
  );
}
