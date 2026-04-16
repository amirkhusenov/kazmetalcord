import { Address } from "@/components/geo/Address";
import { City } from "@/components/geo/City";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import contacts from "@/contacts.json";
import { Building, Clock, Mail, MapPin, Phone, Trophy, Truck, Users } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex-1">
      <h1 className="text-2xl font-bold mb-6">О компании «KazMetalCord»</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-gray-700 mb-4">
            Компания «KazMetalCord» – это ведущий поставщик металлопроката в Казахстане, предлагающий широкий ассортимент металлопродукции высокого качества от ведущих производителей.
          </p>
          <p className="text-gray-700 mb-4">
            С момента основания в 2010 году, наша компания стремится обеспечивать строительные, промышленные и производственные предприятия Казахстана качественными металлоизделиями, соответствующими международным стандартам.
          </p>
          <p className="text-gray-700 mb-4">
            Мы гордимся тем, что за годы работы смогли завоевать доверие сотен клиентов, от частных застройщиков до крупных промышленных предприятий, благодаря нашему ответственному подходу к каждому заказу и конкурентным ценам.
          </p>
        </div>
        <div className="relative w-full h-[300px]">
          <Image
            src="/hero.webp"
            alt="KazMetalCord офис"
            fill
            className="object-cover rounded-md"
          />
        </div>
      </div>

      {/* Key advantages */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-blue-600" />
          Наши преимущества
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

      {/* Company information tabs */}
      <Tabs defaultValue="company" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company">О компании</TabsTrigger>
          <TabsTrigger value="certificates">Сертификаты</TabsTrigger>
          <TabsTrigger value="partners">Партнеры</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="p-4 border rounded-md mt-2">
          <h3 className="font-medium mb-3">История компании</h3>
          <p className="mb-4">
            Компания «KazMetalCord» начала свою деятельность в 2010 году как небольшой поставщик металлопроката в <City />. За годы работы мы значительно расширили географию присутствия и ассортимент продукции.
          </p>
          <p>
            Сегодня «KazMetalCord» – это современная компания с представительствами в 5 крупнейших городах Казахстана, собственными складскими комплексами общей площадью более 15000 м² и штатом квалифицированных сотрудников, готовых помочь клиентам с выбором и приобретением необходимой металлопродукции.
          </p>
        </TabsContent>

        <TabsContent value="certificates" className="p-4 border rounded-md mt-2">
          <h3 className="font-medium mb-3">Наши сертификаты</h3>
          <p className="mb-4">
            Вся продукция компании «KazMetalCord» сертифицирована и соответствует государственным стандартам качества. Мы регулярно проходим аудиты и имеем все необходимые разрешительные документы для осуществления деятельности:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Сертификат соответствия ISO 9001:2015</li>
            <li>Сертификаты качества на всю металлопродукцию</li>
            <li>Лицензия на оптовую и розничную торговлю</li>
            <li>Свидетельство участника программы «Сделано в Казахстане»</li>
          </ul>
        </TabsContent>

        <TabsContent value="partners" className="p-4 border rounded-md mt-2">
          <h3 className="font-medium mb-3">Наши партнеры</h3>
          <p className="mb-4">
            Мы гордимся сотрудничеством с ведущими металлургическими предприятиями Казахстана, России и других стран СНГ. Среди наших партнеров:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Казахстанская металлургическая компания</li>
            <li>Магнитогорский металлургический комбинат</li>
            <li>Новолипецкий металлургический комбинат</li>
            <li>Карагандинский металлургический комбинат</li>
            <li>Евразийская Группа (ERG)</li>
          </ul>
        </TabsContent>
      </Tabs>

      {/* Contact information */}
      <div>
        <h2 className="text-xl font-bold mb-4">Контактная информация</h2>
        <Separator className="mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Адрес</h3>
              <p className="text-gray-600"><Address /></p>
              <p className="text-gray-600">050000, Республика Казахстан</p>
            </div>
          </div>

          <div className="flex items-start">
            <Phone className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Телефоны</h3>
              <p className="text-gray-600">{contacts.phone.text}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Mail className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Email</h3>
              <p className="text-gray-600">{contacts.email.info}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">График работы</h3>
              <p className="text-gray-600">Пн-Пт: 9:00 - 18:00</p>
              <p className="text-gray-600">Сб: 9:00 - 14:00, Вс: выходной</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
