import { Injectable } from '@nestjs/common';
import { TagDto } from 'src/models/dtos/tag.dto';
import { WorkBook, WorkSheet } from 'xlsx';
import { LanguageEnum } from 'src/models/enums/language.enum';
import { ArticleDto } from 'src/models/dtos/article.dto';

import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Injectable()
export class ExcelService {

    // Order of columns in excel and their names.
    private XLS_COLUMN_ORDER: { [key: string]: string } = {
        articleContentId: 'Id',
        title: 'Title',
        body: 'Body',
        dateOfPublication: 'Date of publication',
        articleType: 'Article type',
        active: 'Active',
        tags: 'Tags',
    };

    // Width of columns in excel.
    private XLS_COLUMN_WIDTHS: { [key: string]: number } = {
        title: 20,
        body: 50,
    };

    /**
     * Export articles to excel.
     * 
     * @param articles  Articles to export. 
     * @returns         Buffer with excel file.
     */
    public exportArticles(articles: ArticleDto[]): Buffer {
        const workbook: WorkBook = XLSX.utils.book_new();
        let rows: string[][];
        let sheet: WorkSheet;

        // Create sheet for each language.
        for (const language of Object.values(LanguageEnum)) {
            rows = this.articlesToAoA(articles.filter((article: ArticleDto) => article.language === language));
            sheet = this.sheetFromAoA(rows, this.XLS_COLUMN_ORDER);
            XLSX.utils.book_append_sheet(workbook, sheet, 'Articles ' + language);
        }

        return XLSX.write(workbook, { type: 'buffer' });
    }

    /**
     * Convert articles to array of arrays. Rows and columns of excel.
     * First row is column names - header.
     * 
     * @param articles  Articles to convert.
     * @returns         Array of arrays. Rows and columns of excel.
     */
    private articlesToAoA(articles: ArticleDto[]): any[][] {
        const columnNames: string[] = Object.values(this.XLS_COLUMN_ORDER);
        const articleAttributes: string[] = Object.keys(this.XLS_COLUMN_ORDER);
        const rows: any[][] = [
            columnNames,
            ...articles.map((content: ArticleDto) =>
                articleAttributes.map((key: keyof ArticleDto) => {
                    if (key === 'dateOfPublication') {
                        if (content[key]) {
                            return moment(content[key]).format('DD.MM.YYYY');
                        }
                    } else if (key === 'tags' && content[key]) {
                        return (content[key] as TagDto[]).map(tag => tag.title).join(', ');
                    } else {
                        return content[key];
                    }
                }),
            ),
        ];
        return rows;
    }

    /**
     * Create sheet from array of arrays. Rows and columns of excel.
     * 
     * @param rows          Array of arrays. Rows and columns of excel.
     * @param columnNames   Column names.
     * @returns             Sheet.
     */
    private sheetFromAoA(rows: string[][], columnNames: { [key: string]: string }): WorkSheet {
        const sheet: WorkSheet = XLSX.utils.aoa_to_sheet(rows, {
            cellStyles: true,
            cellDates: true,
            dateNF: 'dd mmm yyyy;@'
        });
        const orderKeys: Array<string> = Object.keys(columnNames);
        const wscols: Array<any> = orderKeys.map((key: keyof ArticleDto) => ({ width: this.XLS_COLUMN_WIDTHS[key] || 12 }));
        const wsrows: Array<{ hpx: number }> = rows.map(() => ({ hpx: 20 }));
        sheet['!cols'] = wscols;
        sheet['!rows'] = wsrows;
        return sheet;
    }
}
