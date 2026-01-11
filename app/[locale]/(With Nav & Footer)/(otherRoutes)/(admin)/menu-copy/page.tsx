import MenuCardCopyForm from '@/components/forms/MenuCardCopyForm';

/**
 * Admin page for editing the Menu Copy (menu intro paragraphs).
 */
export default function MenuCopyAdminPage() {
    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Menu Copy</h1>
            <MenuCardCopyForm />
        </div>
    );
}
